import { BadRequestException } from '@nestjs/common';
import { createZodValidationPipe } from 'nestjs-zod';
import { ZodError } from 'zod';

export const MyZodValidationPipe = createZodValidationPipe({
  // provide custom validation exception factory
  createValidationException: (error: ZodError) => {
    const customErrors = error.errors.map((error) => error.message);
    console.log('custom', customErrors);
    return new BadRequestException(customErrors);
  },
});
