import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const profileSchema = z.object({
  id: z.string(),
  network: z.string().min(1),
  username: z.string().min(1),
  icon: z
    .string()
    .describe(
      'Slug for the icon from https://simpleicons.org. For example, "github", "linkedin", etc.',
    ),
  url: urlSchema,
});

// Type
export type Profile = z.infer<typeof profileSchema>;

// Defaults
export const defaultProfile: Profile = {
  id: '',
  network: '',
  username: '',
  icon: '',
  url: defaultUrl,
};
