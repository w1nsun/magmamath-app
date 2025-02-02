import { Injectable, PipeTransform } from '@nestjs/common';
import {
  PAGINATION_DEFAULT_LIMIT,
  PAGINATION_DEFAULT_SKIP,
  PaginationDto,
} from '../dtos/pagination.dto';

@Injectable()
export class PaginationPipe implements PipeTransform<PaginationDto, PaginationDto> {
  transform(value: PaginationDto): PaginationDto {
    return {
      skip: value.skip ? Number(value.skip) : PAGINATION_DEFAULT_SKIP,
      limit: value.limit ? Number(value.limit) : PAGINATION_DEFAULT_LIMIT,
    };
  }
}
