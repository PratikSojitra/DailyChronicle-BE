import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  RequestRoleChangeDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  GetUsersFilterDto,
} from './dto/user.dto';
import { buildPaginationResponse } from 'src/common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  public async createUser(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  public async getAllUsers(filters: GetUsersFilterDto) {
    const { page = 1, limit = 10, role, search } = filters;
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user');

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (search) {
      query.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    query.skip(skip).take(limit).orderBy('user.createdAt', 'DESC');

    const [users, total] = await query.getManyAndCount();

    return buildPaginationResponse(users, total, page, limit);
  }

  public async getRoleChangeRequests() {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.requestedRole IS NOT NULL')
      .getMany();
  }

  public async requestRoleChange(id: string, requestRoleChangeDto: RequestRoleChangeDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    user.requestedRole = requestRoleChangeDto.role;
    return this.userRepository.save(user);
  }

  public async getUserById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  public async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  public async deleteUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    return this.userRepository.remove(user);
  }

  public async updateUserRole(
    id: string,
    updateUserRoleDto: UpdateUserRoleDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    // Clear requested role upon role update
    user.requestedRole = null;
    user.role = updateUserRoleDto.role;

    return this.userRepository.save(user);
  }
}
