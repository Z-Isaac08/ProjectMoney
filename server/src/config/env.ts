import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  COOKIE_SECRET: z.string().min(32),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().optional(),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional()
});

export type Env = z.infer<typeof EnvSchema>;

export const env = EnvSchema.parse(process.env);