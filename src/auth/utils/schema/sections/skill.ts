import { z } from 'zod';

// Schema
export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.number().min(0).max(5).default(1),
  keywords: z.array(z.string()).default([]),
});

// Type
export type Skill = z.infer<typeof skillSchema>;

// Defaults
export const defaultSkill: Skill = {
  id: '',
  name: '',
  description: '',
  level: 1,
  keywords: [],
};
