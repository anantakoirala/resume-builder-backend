import { z } from 'zod';
import { defaultUrl, urlSchema } from '../url';

// Schema
export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string(),
  date: z.string(),
  summary: z.string(),
  url: urlSchema,
});

// Type
export type Certification = z.infer<typeof certificationSchema>;

// Defaults
export const defaultCertification: Certification = {
  id: '',
  name: '',
  issuer: '',
  date: '',
  summary: '',
  url: defaultUrl,
};
