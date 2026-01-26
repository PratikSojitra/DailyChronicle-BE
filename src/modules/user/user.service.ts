import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto } from "./dto/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async createUser(createUserDto: CreateUserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }

    public async getAllUsers() {
        const users = await this.userRepository.find();
        return users;
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

    public async updateUserRole(id: string, updateUserRoleDto: UpdateUserRoleDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return this.userRepository.save({ ...user, ...updateUserRoleDto });
    }
}