import { PaginationDto, PaginationPipe, ZodValidationPipe } from '@app/shared';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserMapper,
  UserReqDto,
  UserRespDataDto,
  UserRespDataListDto,
  UsersService,
} from '../../domain/users';
import { Request } from 'express';
import { userSchema } from '../../domain/users/validation/user.zod-schema';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ type: UserRespDataListDto, status: HttpStatus.OK })
  @Get()
  async getAll(@Query(PaginationPipe) pagination: PaginationDto) {
    const users = await this.usersService.findAll(pagination);

    return {
      data: users.data.map(user => UserMapper.toRespDto(user)),
      meta: {
        total: users.total,
        skip: pagination.skip,
        limit: pagination.limit,
      },
    };
  }

  @ApiResponse({ type: UserRespDataDto, status: HttpStatus.CREATED })
  @Post()
  async create(@Body(new ZodValidationPipe(userSchema)) dto: UserReqDto, @Req() req: Request) {
    const reqId = req.id as string;
    const user = await this.usersService.create(dto, reqId);

    return {
      data: UserMapper.toRespDto(user),
    };
  }

  @ApiResponse({ type: UserRespDataDto, status: HttpStatus.OK })
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ZodValidationPipe(userSchema)) dto: UserReqDto) {
    const user = await this.usersService.update(id, dto);

    return {
      data: UserMapper.toRespDto(user),
    };
  }

  @ApiResponse({ status: HttpStatus.OK })
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: Request) {
    const reqId = req.id as string;
    await this.usersService.delete(id, reqId);

    return {
      ok: true,
    };
  }

  @ApiResponse({ type: UserRespDataDto, status: HttpStatus.OK })
  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    return {
      data: UserMapper.toRespDto(user),
    };
  }
}
