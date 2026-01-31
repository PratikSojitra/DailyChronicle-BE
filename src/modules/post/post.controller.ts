import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/decorator/roles.decorator";
import { UserRole } from "src/entities/user.entity";
import { CreatePostDto, UpdatePostDto, UpdatePostStatusDto } from "./dto/post.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Posts')
@Controller('posts')

export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    async getAllPosts() {
        return this.postService.getAllPosts();
    }

    @Get('admin/:getAllPosts')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async getAllPostsByAdmin(@Param('authorId') authorId: string) {
        return this.postService.getAllPostsByAdmin(authorId);
    }

    @Get(':id')
    async getPostById(@Param('id') id: string, @Request() req) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userId = req.user?.id || null;

        return this.postService.getPostById(id, ip, userId);
    }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async createPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.createPost(createPostDto);
    }

    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async updatePost(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.updatePost(id, updatePostDto);
    }

    @Put('status/:id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async updatePostStatus(@Param('id') id: string, @Body() updatePostStatusDto: UpdatePostStatusDto) {
        return this.postService.updatePostStatus(id, updatePostStatusDto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.EDITOR)
    async deletePost(@Param('id') id: string) {
        return this.postService.deletePost(id);
    }
}
