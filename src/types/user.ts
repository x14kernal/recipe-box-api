import z from 'zod';

const userBaseSchema = z.object({
  email: z.email().trim().toLowerCase(),
  username: z.string().trim().toLowerCase(),
  displayName: z.string().trim().toLowerCase().nullable(),
});
const passwordSchema = z.string().min(8).max(24);

export const registerSchema = userBaseSchema.extend({ password: passwordSchema });

export const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase(),
  password: passwordSchema,
});

export const userSchema = userBaseSchema.extend({ id: z.uuid() });

export type User = z.infer<typeof userSchema>;
export type RegisterUserInput = z.infer<typeof registerSchema>;
export type LoginUserInput = z.infer<typeof loginSchema>;
