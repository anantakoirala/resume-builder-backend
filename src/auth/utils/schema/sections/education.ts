import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1),
  studyType: z.string(),
  area: z.string(),
  score: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Education = z.infer<typeof educationSchema>;

// Defaults
export const defaultEducation: Education = {
  id: '',
  institution: '',
  studyType: '',
  area: '',
  score: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
