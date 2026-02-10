import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from 'src/entities/post.entity';

export class CreatePostDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @ApiPropertyOptional({ required: false })
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Content is required' })
  @IsString({ message: 'Content must be a string' })
  content: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Cover image must be a string' })
  coverImage?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsEnum(PostStatus, { message: 'Status must be a valid status' })
  status?: PostStatus;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Author ID is required' })
  @IsString({ message: 'Author ID must be a string' })
  authorId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Category ID is required' })
  @IsString({ message: 'Category ID must be a string' })
  categoryId: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Cover image must be a string' })
  coverImage?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Status must be a string' })
  @IsEnum(PostStatus, { message: 'Status must be a valid status' })
  status?: PostStatus;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Author ID must be a string' })
  authorId?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Category ID must be a string' })
  categoryId?: string;
}

export class UpdatePostStatusDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Status is required' })
  @IsString({ message: 'Status must be a string' })
  @IsEnum(PostStatus, { message: 'Status must be a valid status' })
  status: PostStatus;
}
