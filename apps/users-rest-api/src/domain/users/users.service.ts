import { PaginationDto } from '@app/shared';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ObjectId } from 'mongodb';
import { USER_EVENTS_TOPIC } from './constants';
import { TUserEvent, USER_CREATED_EVENT, USER_DELETED_EVENT } from './dtos/user-events.dto';
import { TUsersList, UserReqDto } from './dtos/user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject('KAFKA_USERS_CLIENT') private readonly kafkaClient: ClientProxy,
  ) {}

  async create(dto: UserReqDto, reqId?: string): Promise<User> {
    const id = new ObjectId().toString();
    const newUser = new User(id, dto.name, dto.email);
    await this.userRepository.create(newUser);

    this.kafkaClient.emit(USER_EVENTS_TOPIC, {
      headers: {
        'x-req-id': reqId,
      },
      key: reqId,
      value: {
        event: USER_CREATED_EVENT,
        data: {
          id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
      } satisfies TUserEvent,
    });

    return newUser;
  }

  async update(id: string, dto: UserReqDto): Promise<User> {
    let user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    user = await this.userRepository.update(id, dto);

    return user;
  }

  async delete(id: string, reqId?: string): Promise<void> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.kafkaClient.emit(USER_EVENTS_TOPIC, {
      headers: {
        'x-req-id': reqId,
      },
      key: reqId,
      value: {
        event: USER_DELETED_EVENT,
        data: {
          id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      } satisfies TUserEvent,
    });

    await this.userRepository.delete(id);
  }

  async findById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async findAll(pagination: PaginationDto): Promise<TUsersList> {
    return await this.userRepository.findAll(pagination);
  }
}
