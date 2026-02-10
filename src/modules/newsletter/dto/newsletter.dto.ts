import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Post } from 'src/entities/post.entity';

export class CreateNewsletterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Cover Image is required' })
  @IsString({ message: 'Cover Image must be a string' })
  coverImage: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Posts is required' })
  posts: Post[];
}

export class SubscribeDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'Is Active must be a boolean' })
  isActive?: boolean;
}

export class UpdateSubscriberDto {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  email?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'Is Active must be a boolean' })
  isActive?: boolean;
}
