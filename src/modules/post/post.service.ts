import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post, PostStatus } from "src/entities/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto";

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private postRepository: Repository<Post>
    ) {}

    public async createPost(createPostDto: CreatePostDto) {
        // const post = this.postRepository.create(createPostDto);
        // return this.postRepository.save(post);
        return 'post is created';
    }

    public async getAllPosts() {
        // return this.postRepository.find();
        return 'all posts are fetched';
    }

    public async getPostById(id: string) {
        // return this.postRepository.findOne({ where: { id } });
        return 'post is fetched';
    }

    public async updatePost(id: string, updatePostDto: UpdatePostDto) {
        // return this.postRepository.update(id, updatePostDto);
        return 'post is updated';
    }

    public async deletePost(id: string) {
        // return this.postRepository.delete(id);
        return 'post is deleted';
    }

    public async getAllPostsByAdmin(authorId: string) {
        // return this.postRepository.find({ where: { author: { id: authorId } } });
        return 'all posts are fetched by admin';
    }
}