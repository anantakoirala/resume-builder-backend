import { z } from 'zod';

// Schema
export const interestSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  keywords: z.array(z.string()).default([]),
});

// Type
export type Interest = z.infer<typeof interestSchema>;

// Defaults
export const defaultInterest: Interest = {
  id: '',
  name: '',
  keywords: [],
};
