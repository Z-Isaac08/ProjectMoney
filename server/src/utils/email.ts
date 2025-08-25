import nodemailer from 'nodemailer';
import { EmailConfig, EmailOptions } from '../types/utils';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter(): void {
    if (!process.env.EMAIL_HOST) {
      console.warn('Email configuration not found. Email service will be disabled.');
      this.isConfigured = false;
      return;
    }

    const config: EmailConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!
      }
    };

    this.transporter = nodemailer.createTransport(config);
    this.isConfigured = true;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.error('Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: options.from || process.env.EMAIL_FROM || 'noreply@projectmoney.com',
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`[DEV MODE] Verification code for ${email}: ${code}`);
      return true;
    }

    const html = `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return await this.sendEmail({
      to: email,
      subject: 'Email Verification Code',
      html
    });
  }

  async send2FACode(email: string, code: string): Promise<boolean> {
    if (!this.isConfigured) {
      console.log(`[DEV MODE] 2FA code for ${email}: ${code}`);
      return true;
    }

    const html = `
      <h2>Two-Factor Authentication</h2>
      <p>Your 2FA code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please secure your account immediately.</p>
    `;

    return await this.sendEmail({
      to: email,
      subject: '2FA Authentication Code',
      html
    });
  }
}

const emailService = new EmailService();
export default emailService;