import z from 'zod';

const userFieldsSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export const signupSchema = userFieldsSchema.extend({
  password: z.string().min(8).max(24),
});
export const loginSchema = userFieldsSchema.extend({
  password: z.string().min(8).max(24),
});

export const userSchema = userFieldsSchema.extend({
  id: z.uuid(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof signupSchema>;
