import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guard";
import { UserService } from "./user.service";
import { Roles } from "src/decorator/roles.decorator";
import { CreateUserDto, UpdateUserDto, UpdateUserRoleDto } from "./dto/user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Post()
    @Roles('admin')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }
    
    @Get()
    @Roles('admin')
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Put('role/:id')
    @Roles('admin')
    async updateUserRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserRoleDto) {
        return this.userService.updateUserRole(id, updateUserDto);
    }

    @Delete(':id')
    @Roles('admin')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}