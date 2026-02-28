import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserService } from './user.service';
import { Roles } from 'src/decorator/roles.decorator';
import {
  CreateUserDto,
  RequestRoleChangeDto,
  UpdateUserDto,
  UpdateUserRoleDto,
  GetUsersFilterDto,
} from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(@Query() filters: GetUsersFilterDto) {
    return this.userService.getAllUsers(filters);
  }

  @Get('role-requests')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async getRoleChangeRequests() {
    return this.userService.getRoleChangeRequests();
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  async getUserById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put('role/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRoleDto,
  ) {
    return this.userService.updateUserRole(id, updateUserDto);
  }

  @Put('request-role/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'))
  async requestRoleChange(
    @Param('id') id: string,
    @Body() requestRoleChangeDto: RequestRoleChangeDto,
  ) {
    return this.userService.requestRoleChange(id, requestRoleChangeDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
