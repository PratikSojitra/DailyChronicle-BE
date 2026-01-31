import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, PostStatus } from "src/entities/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto, UpdatePostDto, UpdatePostStatusDto } from "./dto/post.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ) {}

    public async createPost(createPostDto: CreatePostDto) {
        const createPostPayload = {
            ...createPostDto,
            slug: createPostDto.slug || createPostDto.title.toLowerCase().replace(/\s+/g, '-'),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        const post = this.postRepository.create(createPostPayload);
        return this.postRepository.save(post);
    }

    public async getAllPosts() {
        return this.postRepository.find({
            relations: ['author', 'category']
        });
    }

    public async getPostById(id: string) {
        const post = await this.postRepository.findOne({ where: { id }, relations: ['author', 'category'] });
        if (!post) throw new NotFoundException(`Post with ID ${id} not found`);
        await this.postRepository.update(id, { views: post.views + 1 });
        return post;
    }

    public async updatePost(id: string, updatePostDto: UpdatePostDto) {
        return this.postRepository.update(id, updatePostDto);
    }

    public async updatePostStatus(id: string, updatePostDto: UpdatePostStatusDto) {
        return this.postRepository.update(id, updatePostDto);
    }

    public async deletePost(id: string) {
        return this.postRepository.delete(id);
    }

    public async getAllPostsByAdmin(authorId: string) {
        return this.postRepository.find({ where: { author: { id: authorId } }, relations: ['author', 'category'] });
    }
}