// import { PartialType } from '@nestjs/mapped-types';
// import { CreateResumeDto } from './create-resume.dto';

// import { createZodDto } from 'nestjs-zod/dto';
// import {
//   defaultResumeData,
//   resumeDataSchema,
// } from 'src/auth/utils/schema/resumeSchema';
// import { z } from 'zod';

// // export class UpdateResumeDto extends PartialType(CreateResumeDto) {}

// export const UpdateResumeSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   slug: z.string(),
//   data: resumeDataSchema.default(defaultResumeData),
//   visibility: z.enum(['public', 'private']).default('private'),
// });

// export class UpdateResumeDto extends createZodDto(UpdateResumeSchema) {}

import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import {
  defaultResumeData,
  resumeDataSchema,
} from 'src/auth/utils/schema/resumeSchema';

const UpdateResumeSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  data: resumeDataSchema.default(defaultResumeData),

  locked: z.boolean().default(false),
  userId: z.string(),
  createdAt: z.date().or(z.dateString()),
  updatedAt: z.date().or(z.dateString()),
});

export type Resume = z.infer<typeof UpdateResumeSchema>;

// class is required for using DTO as a type
export class UpdateResumeDto extends createZodDto(UpdateResumeSchema) {}
