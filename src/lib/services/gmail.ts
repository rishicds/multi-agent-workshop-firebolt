import { logger } from '@/lib/utils/logger';
import * as nodemailer from 'nodemailer';

type EmailPayload = {
  recipient: string;
  subject: string;
  body: string;
};

/**
 * Gmail client with sandbox default. Real API calls can be wired using OAuth2 / Gmail API.
 */
export class GmailClient {
  private sandbox: boolean;
  private transporter: any;

  constructor() {
    // Check if Gmail is explicitly enabled
    const isEnabled = process.env.GMAIL_ENABLED === 'true';
    
    // Check if Gmail credentials are configured
    const hasCredentials = process.env.GMAIL_USER && 
                          process.env.GMAIL_APP_PASSWORD &&
                          process.env.GMAIL_USER !== 'your_email@gmail.com';
    
    // Use sandbox mode unless credentials are provided AND it's enabled
    this.sandbox = !hasCredentials || !isEnabled;
    
    if (!this.sandbox && hasCredentials) {
      // Configure nodemailer with Gmail SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      
      logger.info('Gmail client initialized in REAL mode', {
        user: process.env.GMAIL_USER,
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
      });
    } else {
      logger.info('Gmail client initialized in SANDBOX mode', {
        reason: !hasCredentials ? 'credentials not configured' : 'GMAIL_ENABLED not set to true'
      });
    }
  }

  async send(payload: EmailPayload): Promise<boolean> {
    if (this.sandbox) {
      logger.info('Gmail sandbox send', { 
        recipient: payload.recipient,
        subject: payload.subject,
        bodyLength: payload.body.length,
        isHTML: payload.body.includes('<!DOCTYPE html>')
      });
      return true;
    }
    
    try {
      const fromName = process.env.GMAIL_FROM_NAME || 'Multi-Agent Workshop';
      const fromEmail = process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_USER;
      
      // Check if body is HTML
      const isHTML = payload.body.includes('<!DOCTYPE html>') || payload.body.includes('<html');
      
      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: payload.recipient,
        subject: payload.subject,
        // If HTML, use html field; otherwise, convert plain text to simple HTML
        ...(isHTML 
          ? { html: payload.body }
          : { 
              text: payload.body,
              html: payload.body.replace(/\n/g, '<br>') 
            }
        ),
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      logger.info('Gmail real send successful', { 
        messageId: info.messageId,
        recipient: payload.recipient,
        isHTML
      });
      return true;
    } catch (error) {
      logger.error('Gmail send failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        recipient: payload.recipient 
      });
      return false;
    }
  }
}


