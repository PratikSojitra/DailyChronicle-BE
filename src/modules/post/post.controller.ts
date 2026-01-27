import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorator/roles.decorator";
import { UserRole } from "src/entities/user.entity";
import { CreatePostDto, UpdatePostDto } from "./dto/post.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Posts')
@Controller('posts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getAllPosts() {
        return this.postService.getAllPosts();
    }

    @Get('admin/:getAllPosts')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async getAllPostsByAdmin(@Param('authorId') authorId: string) {
        return this.postService.getAllPostsByAdmin(authorId);
    }

    @Get(':id')
    async getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(createPostDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.updatePost(id, updatePostDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async deletePost(@Param('id') id: string) {
        return this.postService.deletePost(id);
    }
}
