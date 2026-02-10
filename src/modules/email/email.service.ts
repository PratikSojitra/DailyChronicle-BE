import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailTemplates } from './email.templates';

// Define valid email types
export type EmailType = 'welcome' | 'newsletter' | 'resetPassword';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly publicUrl =
    process.env.PUBLIC_FRONTEND_URL || 'http://localhost:3000'; // Centralized Config

  constructor(private readonly mailerService: MailerService) {}

  // --- SINGLE EMAIL SENDER ---
  async sendEmail(
    to: string,
    type: EmailType,
    context: any = {},
    frontendUrl?: string,
  ) {
    // 1. Get the correct template generator
    const templateFn = EmailTemplates[type];
    if (!templateFn) throw new Error(`Invalid email type: ${type}`);

    // 2. Generate content (Inject email and URL automatically)
    const { subject, html } = templateFn({
      ...context,
      email: to,
      frontendUrl: frontendUrl || this.publicUrl,
    });

    // 3. Send
    try {
      await this.mailerService.sendMail({ to, subject, html });
      this.logger.log(`Email (${type}) sent to ${to}`);
    } catch (err) {
      this.logger.error(`Failed to send (${type}) to ${to}: ${err.message}`);
    }
  }

  // --- BATCH SENDER (The "Utility" for Newsletters) ---
  async sendBulkEmail(recipients: string[], type: EmailType, context: any) {
    const BATCH_SIZE = 20;
    const DELAY_MS = 1000;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    this.logger.log(
      `Starting Bulk Email: ${type} to ${recipients.length} users.`,
    );

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);

      // Send parallel requests for this batch
      await Promise.all(
        batch.map((email) => this.sendEmail(email, type, context)),
      );

      // Wait if there are more batches left
      if (i + BATCH_SIZE < recipients.length) {
        await sleep(DELAY_MS);
      }
    }

    return { success: true, count: recipients.length };
  }
}
