import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().min(1).max(255),
});

type TUserSchema = z.infer<typeof userSchema>;

export { userSchema, TUserSchema };
