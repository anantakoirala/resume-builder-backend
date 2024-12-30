import { z } from 'zod';

export const summarySchema = z.object({
  content: z.string().default(''),
});

export type Summary = z.infer<typeof summarySchema>;

export const defaultSummary: Summary = {
  content: '',
};
