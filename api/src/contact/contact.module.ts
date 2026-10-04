import { Module } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.module';

export class CreateContactDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(5) @MaxLength(3000) message!: string;
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

@Controller('contact')
class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /** POST /api/contact — persist a message and email the owner (reply-to = sender). */
  @Post()
  async create(@Body() dto: CreateContactDto) {
    const row = await this.prisma.contactMessage.create({ data: dto });

    // Notify the owner. The visitor's address is the Reply-To, so hitting
    // "Reply" in the inbox reaches them directly — the owner follows up manually.
    try {
      await this.mail.send({
        replyTo: `${dto.name} <${dto.email}>`,
        subject: `New portfolio message from ${dto.name}`,
        text:
          `New message from your portfolio contact form\n\n` +
          `Name:  ${dto.name}\n` +
          `Email: ${dto.email}\n` +
          `Sent:  ${row.createdAt.toISOString()}\n\n` +
          `Message:\n${dto.message}\n\n` +
          `— Reply to this email to respond directly to ${dto.name}.`,
        html:
          `<h2 style="margin:0 0 12px">New portfolio message</h2>` +
          `<p style="margin:0 0 4px"><b>Name:</b> ${esc(dto.name)}</p>` +
          `<p style="margin:0 0 4px"><b>Email:</b> <a href="mailto:${esc(dto.email)}">${esc(dto.email)}</a></p>` +
          `<p style="margin:0 0 12px"><b>Sent:</b> ${row.createdAt.toISOString()}</p>` +
          `<p style="margin:0 0 6px"><b>Message:</b></p>` +
          `<blockquote style="margin:0;padding:10px 14px;border-left:3px solid #ccc;white-space:pre-wrap">${esc(
            dto.message,
          )}</blockquote>` +
          `<p style="margin:14px 0 0;color:#666;font-size:13px">Reply to this email to respond directly to ${esc(
            dto.name,
          )}.</p>`,
      });
    } catch (err) {
      // Never fail the request if email hiccups — the message is already saved.
      this.logger.error(`Contact email failed: ${(err as Error).message}`);
    }

    return { ok: true, id: row.id, receivedAt: row.createdAt };
  }

  /** GET /api/contact/count — public, non-sensitive proof of persistence. */
  @Get('count')
  async count() {
    return { total: await this.prisma.contactMessage.count() };
  }
}

@Module({ controllers: [ContactController] })
export class ContactModule {}
