import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({ required: true })
    @IsNotEmpty({message : 'Name is required'})
    @IsString({ message: 'Name must be a string' })
    name: string;

    @ApiProperty({ required: true })
    @IsNotEmpty({message : 'Slug is required'})
    @IsString({ message: 'Slug must be a string' })
    slug: string;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNotEmpty({message : 'Name is required'})
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsNotEmpty({message : 'Slug is required'})
    @IsString({ message: 'Slug must be a string' })
    slug?: string;
}