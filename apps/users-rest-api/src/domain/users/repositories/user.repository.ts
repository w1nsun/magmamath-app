import { Collection, MongoClient, MongoServerError, ObjectId } from 'mongodb';
import { User, UserDocument } from '../entities/user.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDto } from '@app/shared';
import { TUsersList } from '../dtos/user.dto';

export const USERS_COLLECTION = 'users';

@Injectable()
export class UserRepository {
  private collection: Collection<UserDocument>;

  constructor(mongoClient: MongoClient) {
    this.collection = mongoClient.db().collection(USERS_COLLECTION);
  }

  async create(user: User): Promise<void> {
    try {
      await this.collection.insertOne({
        _id: new ObjectId(user.id),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      if (error instanceof MongoServerError && error.code === 11000) {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: Partial<User>): Promise<User> {
    delete dto.createdAt;

    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...dto } },
      { returnDocument: 'after' },
    );

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return User.fromDocument(result);
  }

  async delete(id: string): Promise<void> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });

    if (!result.deletedCount) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findById(id: string): Promise<User> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return User.fromDocument(result);
  }

  async findAll(pagination: PaginationDto): Promise<TUsersList> {
    const result = await this.collection
      .aggregate<{ totalCount: { count: number }[]; paginatedResults: UserDocument[] }>([
        {
          $facet: {
            totalCount: [
              {
                $count: 'total',
              },
            ],
            paginatedResults: [
              { $sort: { _id: -1 } },
              { $skip: pagination.skip },
              { $limit: pagination.limit },
            ],
          },
        },
      ])
      .toArray();

    const totalCount = result[0]?.totalCount[0]?.count ?? 0;
    const paginatedResults = result[0].paginatedResults;

    return {
      data: paginatedResults.map(document => User.fromDocument(document)),
      total: totalCount,
    };
  }
}
