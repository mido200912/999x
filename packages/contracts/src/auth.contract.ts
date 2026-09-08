import { z } from 'zod';

export const Role = z.enum(['SUPER_ADMIN', 'OPS_MEMBER', 'CLIENT_ADMIN']);

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: Role,
  clientId: z.string().optional(),
});

export const JWTPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  role: Role,
  clientId: z.string().optional(),
  iat: z.number(),
  exp: z.number(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;
