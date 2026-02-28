import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post, PostStatus } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import {
  CreatePostDto,
  GetPostsFilterDto,
  UpdatePostDto,
  UpdatePostStatusDto,
} from './dto/post.dto';
import { PostView } from 'src/entities/postView.entity';
import { buildPaginationResponse } from 'src/common/dto/pagination.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(PostView)
    private postViewRepository: Repository<PostView>,
  ) { }

  public async createPost(createPostDto: CreatePostDto) {
    const createPostPayload = {
      ...createPostDto,
      slug:
        createPostDto.slug ||
        createPostDto.title.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const post = this.postRepository.create(createPostPayload);
    return this.postRepository.save(post);
  }

  public async getAllPosts(filters?: GetPostsFilterDto) {
    const query = this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.category', 'category');

    if (filters?.authorId) {
      query.andWhere('author.id = :authorId', { authorId: filters.authorId });
    }

    if (filters?.categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId: filters.categoryId });
    }

    if (filters?.categorySlug) {
      query.andWhere('category.slug = :categorySlug', { categorySlug: filters.categorySlug });
    }

    if (filters?.startDate) {
      query.andWhere('post.createdAt >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('post.createdAt <= :endDate', { endDate: filters.endDate });
    }

    if (filters?.search) {
      query.andWhere(
        '(post.title ILIKE :search OR post.slug ILIKE :search OR post.content ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    const { page = 1, limit = 10 } = filters || {};
    const skip = (page - 1) * limit;

    query.skip(skip).take(limit).orderBy('post.createdAt', 'DESC');

    const [posts, total] = await query.getManyAndCount();

    return buildPaginationResponse(posts, total, page, limit);
  }

  public async getPostById(id: string, ip?: string, userId?: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'category'],
    });
    if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
    let alreadyViewed = false;

    if (userId) {
      const postView = await this.postViewRepository.findOne({
        where: { post: { id }, viewer: { id: userId } },
      });
      if (postView) alreadyViewed = true;
    } else {
      const postView = await this.postViewRepository.findOne({
        where: { post: { id }, userIp: ip },
      });
      if (postView) alreadyViewed = true;
    }

    if (!alreadyViewed) {
      const postView = this.postViewRepository.create({
        post: { id },
        viewer: { id: userId },
        userIp: ip,
      });
      await this.postViewRepository.save(postView);

      await this.postRepository.increment({ id }, 'views', 1);
      post.views = (post.views || 0) + 1;
    }
    return post;
  }

  public async updatePost(id: string, updatePostDto: UpdatePostDto) {
    return this.postRepository.update(id, updatePostDto);
  }

  public async updatePostStatus(
    id: string,
    updatePostDto: UpdatePostStatusDto,
  ) {
    return this.postRepository.update(id, updatePostDto);
  }

  public async deletePost(id: string) {
    return this.postRepository.delete(id);
  }

  public async getAllPostsByAdmin(authorId: string) {
    return this.postRepository.find({
      where: { author: { id: authorId } },
      relations: ['author', 'category'],
    });
  }
}
