import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const refrenceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Refrence = z.infer<typeof refrenceSchema>;

// Defaults
export const defaultRefrence: Refrence = {
  id: '',
  name: '',
  description: '',
  summary: '',
  url: defaultUrl,
};
