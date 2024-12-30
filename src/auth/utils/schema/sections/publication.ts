import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const publicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  publisher: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Publication = z.infer<typeof publicationSchema>;

// Defaults
export const defaultPublication: Publication = {
  id: '',
  name: '',
  publisher: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
