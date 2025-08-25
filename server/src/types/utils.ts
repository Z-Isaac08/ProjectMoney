export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface JWTPayload {
  userId: string;
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenResult {
  token: string;
  expiresIn: string;
}

export interface TwoFactorCodeResult {
  code: string;
  expiresAt: Date;
}