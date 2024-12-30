import { z } from 'zod';

import { basicsSchema, defaultBasics } from './basics';
import { sectionDefault, sectionsSchema } from './sectionsSchema';
import { defaultSummary, summarySchema } from './sections/summary';
import { MetaDataSchema, defaultMetadata } from './metadata';

// Schema
export const resumeDataSchema = z.object({
  basics: basicsSchema,
  summary: summarySchema,
  sections: sectionsSchema,
  metadata: MetaDataSchema,
});

// Type
export type ResumeData = z.infer<typeof resumeDataSchema>;

// Defaults
export const defaultResumeData: ResumeData = {
  basics: defaultBasics,
  summary: defaultSummary,
  sections: sectionDefault,
  metadata: defaultMetadata,
};
