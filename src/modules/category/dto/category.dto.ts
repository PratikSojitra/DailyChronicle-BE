import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class CreateCategoryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}

export class GetCategoriesFilterDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by Parent ID' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Search loosely by name or slug' })
  @IsOptional()
  @IsString()
  search?: string;
}
