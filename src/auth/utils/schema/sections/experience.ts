import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const experienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  position: z.string(),
  location: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Experience = z.infer<typeof experienceSchema>;

// Defaults
export const defaultEducation: Experience = {
  id: '',
  company: '',
  position: '',
  location: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
