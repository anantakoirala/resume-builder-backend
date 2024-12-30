import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  date: z.string(),
  summary: z.string(),
  keywords: z.array(z.string()).default([]),
  url: urlSchema,
});

// Type
export type Project = z.infer<typeof projectSchema>;

// Defaults
export const defaultProject: Project = {
  id: '',
  name: '',
  description: '',
  date: '',
  summary: '',
  keywords: [],
  url: defaultUrl,
};
