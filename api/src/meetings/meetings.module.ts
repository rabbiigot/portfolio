import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Injectable,
  Logger,
  Module,
  Post,
  Query,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

// Full calendar scope (create events + Meet links) plus the owner's email.
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ');

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

class BookMeetingDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be YYYY-MM-DD' }) date!: string;
  @IsString() @Matches(/^\d{2}:\d{2}$/, { message: 'time must be HH:mm' }) time!: string;
  @IsOptional() @IsString() @MaxLength(2000) message?: string;
}

@Injectable()
export class MeetingsService {
  private readonly logger = new Logger(MeetingsService.name);
  private readonly clientId = process.env.GOOGLE_CLIENT_ID || '';
  private readonly clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  private readonly callbackUrl = process.env.GOOGLE_CALLBACK_URL || '';
  private readonly timeZone = process.env.MEETINGS_TIMEZONE || 'Asia/Manila';
  private readonly durationMin = Number(process.env.MEETINGS_DURATION_MIN || 30);
  private readonly setupKey = process.env.MEETINGS_SETUP_KEY || '';

  constructor(private readonly prisma: PrismaService) {}

  get isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret && this.callbackUrl);
  }

  /** Build the Google consent URL for the one-time owner connect. */
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: 'code',
      scope: SCOPES,
      access_type: 'offline', // we need a refresh token
      prompt: 'consent', // force refresh_token every time
      state: 'portfolio',
    });
    return `${AUTH_URL}?${params}`;
  }

  assertSetupKey(key?: string) {
    // When MEETINGS_SETUP_KEY is set, the connect flow requires it so only the
    // owner can link the calendar. Unset = open (local dev only).
    if (this.setupKey && key !== this.setupKey) {
      throw new UnauthorizedException('Invalid setup key');
    }
  }

  /** Exchange the OAuth code and store the owner's tokens (singleton row). */
  async handleCallback(code: string): Promise<{ googleEmail: string }> {
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.callbackUrl,
        grant_type: 'authorization_code',
      }),
    });
    const token = await tokenRes.json();
    if (token.error || !token.refresh_token) {
      throw new BadRequestException(
        `Google OAuth failed: ${token.error_description || token.error || 'no refresh_token returned'}`,
      );
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    const gUser = await userRes.json();
    const googleEmail = gUser.email || 'unknown';
    const tokenExpiry = new Date(Date.now() + Number(token.expires_in || 3600) * 1000);

    // Singleton: one owner calendar.
    await this.prisma.googleCredential.deleteMany({});
    await this.prisma.googleCredential.create({
      data: {
        googleEmail,
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
        tokenExpiry,
        scope: token.scope || SCOPES,
      },
    });
    this.logger.log(`Google Calendar connected as ${googleEmail}`);
    return { googleEmail };
  }

  async getStatus() {
    const cred = await this.prisma.googleCredential.findFirst();
    return cred
      ? { connected: true, googleEmail: cred.googleEmail }
      : { connected: false };
  }

  /** Current access token, refreshed if it's within 5 minutes of expiry. */
  private async getValidToken(): Promise<string> {
    const cred = await this.prisma.googleCredential.findFirst();
    if (!cred) {
      throw new ServiceUnavailableException(
        'Booking is not connected to a calendar yet.',
      );
    }
    if (cred.tokenExpiry.getTime() > Date.now() + 5 * 60 * 1000) {
      return cred.accessToken;
    }
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: cred.refreshToken,
        grant_type: 'refresh_token',
      }),
    });
    const data = await res.json();
    if (data.error) {
      throw new ServiceUnavailableException(
        'Calendar token expired — the owner needs to reconnect.',
      );
    }
    const tokenExpiry = new Date(Date.now() + Number(data.expires_in || 3600) * 1000);
    await this.prisma.googleCredential.update({
      where: { id: cred.id },
      data: { accessToken: data.access_token, tokenExpiry },
    });
    return data.access_token as string;
  }

  async book(dto: BookMeetingDto) {
    const token = await this.getValidToken();

    // Treat the submitted date/time as wall-clock in the owner's timeZone.
    // We append 'Z' only to do safe arithmetic, then send naive local strings
    // plus an explicit timeZone so Google interprets them correctly.
    const startCalc = new Date(`${dto.date}T${dto.time}:00Z`);
    if (Number.isNaN(startCalc.getTime())) {
      throw new BadRequestException('Invalid date/time');
    }
    const endCalc = new Date(startCalc.getTime() + this.durationMin * 60_000);
    const naive = (d: Date) => d.toISOString().slice(0, 19); // YYYY-MM-DDTHH:MM:SS

    const requestId = `pf-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const body = {
      summary: `Meeting with ${dto.name}`,
      description:
        (dto.message ? `${dto.message}\n\n` : '') +
        `Intro meeting booked via the portfolio contact page by ${dto.name} (${dto.email}).`,
      start: { dateTime: naive(startCalc), timeZone: this.timeZone },
      end: { dateTime: naive(endCalc), timeZone: this.timeZone },
      attendees: [{ email: dto.email }],
      conferenceData: {
        createRequest: {
          requestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const event = await res.json();
    if (!res.ok) {
      this.logger.error(`Calendar insert failed: ${JSON.stringify(event?.error || event)}`);
      throw new BadRequestException(
        event?.error?.message || 'Could not create the calendar event.',
      );
    }

    const meetLink: string | null =
      event.hangoutLink ||
      event.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri ||
      null;

    const meeting = await this.prisma.meeting.create({
      data: {
        name: dto.name,
        email: dto.email,
        startsAt: startCalc,
        endsAt: endCalc,
        meetLink,
        eventId: event.id || null,
        message: dto.message || null,
      },
    });

    return {
      ok: true as const,
      id: meeting.id,
      meetLink,
      eventId: event.id,
      startsAt: `${dto.date}T${dto.time}`,
      timeZone: this.timeZone,
    };
  }
}

@Controller('meetings')
class MeetingsController {
  constructor(private readonly meetings: MeetingsService) {}

  /** GET /api/meetings/status — is a calendar linked? */
  @Get('status')
  status() {
    return this.meetings.getStatus();
  }

  /** GET /api/meetings/google/connect?key=… — one-time owner consent. */
  @Get('google/connect')
  connect(@Query('key') key: string, @Res() res: Response) {
    if (!this.meetings.isConfigured) {
      throw new ServiceUnavailableException('Google OAuth is not configured.');
    }
    this.meetings.assertSetupKey(key);
    return res.redirect(this.meetings.getAuthUrl());
  }

  /** GET /api/meetings/google/callback — OAuth redirect target. */
  @Get('google/callback')
  async callback(
    @Query('code') code: string,
    @Query('error') error: string,
    @Res() res: Response,
  ) {
    if (error) {
      return res.status(400).send(`Google authorization failed: ${error}`);
    }
    if (!code) {
      return res.status(400).send('Missing authorization code.');
    }
    const { googleEmail } = await this.meetings.handleCallback(code);
    return res
      .status(200)
      .send(
        `<h2>Calendar connected ✅</h2><p>Bookings will land on <b>${googleEmail}</b>. You can close this tab.</p>`,
      );
  }

  /** POST /api/meetings/book — create a real Google Meet event. */
  @Post('book')
  book(@Body() dto: BookMeetingDto) {
    return this.meetings.book(dto);
  }
}

@Module({
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}
