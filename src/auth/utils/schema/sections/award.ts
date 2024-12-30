import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const awardSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  awarder: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Award = z.infer<typeof awardSchema>;

// Defaults
export const defaultAward: Award = {
  id: '',
  title: '',
  awarder: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
