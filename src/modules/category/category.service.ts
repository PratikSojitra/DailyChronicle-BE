import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from 'src/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const { parentId, ...rest } = createCategoryDto;
    const savePayload = {
      ...rest,
      ...(parentId ? { parentCategory: { id: parentId } } : {}),
    };
    const category = this.categoryRepository.create(savePayload);
    return this.categoryRepository.save(category);
  }

  public async getAllCategories() {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      // You can deeply nested left joins if needed, e.g. 'subcategories.subcategories'
      // But typically one or two levels is enough for most UIs
      .loadRelationCountAndMap('category.postCount', 'category.posts')
      .loadRelationCountAndMap('subcategories.postCount', 'subcategories.posts')
      .where('category.parentCategory IS NULL') // Only fetch root categories (where parent is null)
      .getMany();
  }

  public async getCategoryById(id: string) {
    return this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .loadRelationCountAndMap('category.postCount', 'category.posts')
      .where('category.id = :id', { id })
      .getOne();
  }

  public async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Category not found');
    }
    const { parentId, ...rest } = updateCategoryDto;
    const updatePayload: any = { ...rest };

    if (parentId !== undefined) {
      updatePayload.parentCategory = parentId ? { id: parentId } : null;
    }

    return this.categoryRepository.save({ ...category, ...updatePayload });
  }

  public async deleteCategory(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new Error('Category not found');
    }
    return this.categoryRepository.remove(category);
  }
}
