import { Global, Injectable, Logger, Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to?: string;
  from?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
}

/**
 * Thin SMTP mailer (nodemailer). Provider-agnostic — configured entirely via
 * env so you can point it at Resend, Gmail, etc. without code changes:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *   CONTACT_FROM  — default "From" (e.g. "Portfolio <portfolio@syncstack.tech>")
 *   CONTACT_TO    — default "To" (the owner's inbox)
 * If SMTP isn't configured the service is a no-op, so the app still runs.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT || 587);
    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // 465 = implicit TLS; 587/2587 = STARTTLS
        auth: { user, pass },
      });
      this.logger.log(`SMTP mailer ready (${host}:${port})`);
    } else {
      this.transporter = null;
      this.logger.warn('SMTP not configured — contact emails will be skipped.');
    }
  }

  get enabled(): boolean {
    return this.transporter !== null;
  }

  async send(opts: SendMailOptions): Promise<{ sent: boolean }> {
    if (!this.transporter) {
      this.logger.warn(`Email skipped (SMTP off): "${opts.subject}"`);
      return { sent: false };
    }
    const from =
      opts.from || process.env.CONTACT_FROM || 'Portfolio <portfolio@syncstack.tech>';
    const to = opts.to || process.env.CONTACT_TO || '';
    if (!to) {
      this.logger.error('No recipient (CONTACT_TO unset) — email skipped.');
      return { sent: false };
    }
    await this.transporter.sendMail({
      from,
      to,
      replyTo: opts.replyTo,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
    return { sent: true };
  }
}

@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
