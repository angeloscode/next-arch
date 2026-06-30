import { z } from 'zod';

export const {{name}}Schema = z.object({
  id: z.string(),
  title: z.string().min(1),
});
