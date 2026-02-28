import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @ApiPropertyOptional({ example: UserRole.VIEWER })
  @IsOptional()
  @IsEnum([UserRole.EDITOR, UserRole.VIEWER])
  role?: UserRole.EDITOR | UserRole.VIEWER;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email' })
  email?: string;
}

export class UpdateUserRoleDto {
  @ApiProperty({ example: UserRole.VIEWER })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be a valid role' })
  role: UserRole;
}

export class RequestRoleChangeDto {
  @ApiProperty({ example: UserRole.EDITOR })
  @IsNotEmpty({ message: 'Requested role is required' })
  @IsEnum(UserRole, { message: 'Requested role must be a valid role' })
  role: UserRole;
}

export class GetUsersFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Search loosely by name or email' })
  @IsOptional()
  @IsString()
  search?: string;
}
