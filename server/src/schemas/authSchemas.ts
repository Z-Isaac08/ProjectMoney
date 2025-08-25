import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email too long')
  .transform(email => email.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name too long')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Name contains invalid characters')
  .transform(name => name.trim());

export const codeSchema = z
  .string()
  .length(6, 'Code must be exactly 6 digits')
  .regex(/^\d{6}$/, 'Code must contain only numbers');

export const tempTokenSchema = z
  .string()
  .min(10, 'Invalid token format')
  .max(100, 'Token too long');

// Request validation schemas
export const checkEmailSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  password: passwordSchema,
});

export const verify2FASchema = z.object({
  tempToken: tempTokenSchema,
  code: codeSchema,
});

export const resend2FASchema = z.object({
  tempToken: tempTokenSchema,
});

// Security validation
export const ipAddressSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^127\.0\.0\.1$|^localhost$/,
    'Invalid IP address'
  )
  .or(z.literal('127.0.0.1'))
  .or(z.literal('::1'))
  .or(z.literal('localhost'));

export const userAgentSchema = z.string().max(500, 'User agent too long');

// Database model validation schemas
export const userCreateSchema = z.object({
  email: emailSchema,
  password: z.string().min(60).max(60), // bcrypt hash length
  firstName: nameSchema,
  lastName: nameSchema,
  role: z.enum(['USER', 'ADMIN', 'MODERATOR']).default('USER'),
});

export const sessionCreateSchema = z.object({
  userId: z.string().cuid(),
  token: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.date(),
  userAgent: userAgentSchema,
  ipAddress: ipAddressSchema,
});

export const twoFACodeCreateSchema = z.object({
  userId: z.string().cuid(),
  code: codeSchema,
  tempToken: tempTokenSchema,
  type: z.enum(['LOGIN', 'REGISTRATION', 'PASSWORD_RESET']),
  expiresAt: z.date(),
});

// Type exports
export type CheckEmailData = z.infer<typeof checkEmailSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type Verify2FAData = z.infer<typeof verify2FASchema>;
export type Resend2FAData = z.infer<typeof resend2FASchema>;
export type UserCreateData = z.infer<typeof userCreateSchema>;
export type SessionCreateData = z.infer<typeof sessionCreateSchema>;
export type TwoFACodeCreateData = z.infer<typeof twoFACodeCreateSchema>;