import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const parseResult = this.schema.safeParse(value);

    if (!parseResult.success) {
      const { error } = parseResult;

      throw new BadRequestException({
        message: 'Validation failed',
        errors: error.errors,
      });
    }

    return parseResult.data;
  }
}
