import { Injectable } from '@nestjs/common';
import { CreateCategoryDto, GetCategoriesFilterDto, UpdateCategoryDto } from './dto/category.dto';
import { Category } from 'src/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { buildPaginationResponse } from 'src/common/dto/pagination.dto';

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

  public async getAllCategories(filters: GetCategoriesFilterDto) {
    const { page = 1, limit = 10, parentId, search } = filters;
    const skip = (page - 1) * limit;

    const query = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.subcategories', 'subcategories')
      .loadRelationCountAndMap('category.postCount', 'category.posts')
      .loadRelationCountAndMap('subcategories.postCount', 'subcategories.posts');

    if (parentId) {
      query.andWhere('category.parentCategory.id = :parentId', { parentId });
    } else if (parentId === null || parentId === undefined) {
      // by default only fetch root categories unless filtering by a specific parent
      query.andWhere('category.parentCategory IS NULL');
    }

    if (search) {
      query.andWhere(
        '(category.name ILIKE :search OR category.slug ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    query.skip(skip).take(limit).orderBy('category.createdAt', 'DESC');

    const [categories, total] = await query.getManyAndCount();

    return buildPaginationResponse(categories, total, page, limit);
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
