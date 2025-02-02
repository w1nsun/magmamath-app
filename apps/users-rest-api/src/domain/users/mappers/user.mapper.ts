import { UserRespDto } from '../dtos/user.dto';
import { User } from '../entities/user.entity';

export class UserMapper {
  static toRespDto(user: User): UserRespDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
