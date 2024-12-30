import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';
import { kebabCase } from 'src/auth/utils/string';

const CreateResumeSchema = z.object({
  title: z.string().min(1, { message: 'Title must be at least 1 character' }),
  slug: z.string().min(1).transform(kebabCase),
  visibility: z.enum(['public', 'private']).default('private'),
});

// class is required for using DTO as a type
export class CreateResumeDto extends createZodDto(CreateResumeSchema) {}
