import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const volunteerSchema = z.object({
  id: z.string(),
  organization: z.string().min(1),
  position: z.string(),
  location: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Volunteer = z.infer<typeof volunteerSchema>;

// Defaults
export const defaultVolunteer: Volunteer = {
  id: '',
  organization: '',
  position: '',
  location: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
