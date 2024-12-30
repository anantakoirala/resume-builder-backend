import { z } from 'zod';

// Schema
export const languageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  level: z.number().min(0).max(5).default(1),
});

// Type
export type Language = z.infer<typeof languageSchema>;

// Defaults
export const defaultLanguage: Language = {
  id: '',
  name: '',
  description: '',
  level: 1,
};
