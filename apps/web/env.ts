import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    SESSION_COOKIE_SECRET: z.string().min(16).default('temporary-secret-for-development-32chars'),
    BACKEND_API_INTERNAL_URL: z.string().url().default('http://localhost:4000/api'),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:4000/api'),
    NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  },
  runtimeEnv: {
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    BACKEND_API_INTERNAL_URL: process.env.BACKEND_API_INTERNAL_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  },
});
