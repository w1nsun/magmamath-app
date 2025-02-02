import { ApiProperty } from '@nestjs/swagger';

export const PAGINATION_DEFAULT_SKIP = 0;
export const PAGINATION_DEFAULT_LIMIT = 10;

export class PaginationDto {
  @ApiProperty({
    example: PAGINATION_DEFAULT_SKIP,
    default: PAGINATION_DEFAULT_SKIP,
    required: false,
  })
  skip!: number;

  @ApiProperty({
    example: PAGINATION_DEFAULT_LIMIT,
    default: PAGINATION_DEFAULT_LIMIT,
    required: false,
  })
  limit!: number;
}
