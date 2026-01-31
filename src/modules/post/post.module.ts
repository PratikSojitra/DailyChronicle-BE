import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "src/entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostView } from "src/entities/postView.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Post, PostView])],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService]
})
export class PostModule {}