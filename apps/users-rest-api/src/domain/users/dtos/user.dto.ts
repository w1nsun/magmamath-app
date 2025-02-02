import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { TUserSchema } from '../validation/user.zod-schema';

/**
 * Implementing TUserSchema to maintain consistency between DTO & Zod schema
 * and to remember to update them when adding fields.
 */
export class UserReqDto implements TUserSchema {
  @ApiProperty({ example: 'Astrid Lindgren' })
  name!: string;

  @ApiProperty({ example: 'astrid.lindgren@gmail.com' })
  email!: string;
}

export class UserRespDto {
  @ApiProperty({ example: '507f191e810c19729de860ea' })
  id!: string;

  @ApiProperty({ example: 'Astrid Lindgren' })
  name!: string;

  @ApiProperty({ example: 'astrid.lindgren@gmail.com' })
  email!: string;

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', type: Date })
  createdAt!: string;
}

/**
 * @description Impossible to use generic types with DTOs
 * @see https://docs.nestjs.com/openapi/types-and-parameters#generics-and-interfaces
 */
export class UserRespDataDto {
  @ApiProperty()
  data!: UserRespDto;
}

class UserRespDataListMetaDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 0 })
  skip!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}

export class UserRespDataListDto {
  @ApiProperty({ type: UserRespDto, isArray: true })
  data!: UserRespDto[];

  @ApiProperty({ type: UserRespDataListMetaDto })
  meta!: UserRespDataListMetaDto;
}

export type TUsersList = {
  data: User[];
  total: number;
};
