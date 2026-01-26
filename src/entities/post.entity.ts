import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Category } from "./category.entity";

export enum PostStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    UNPUBLISHED = 'unpublished',
}

@Entity('posts')

export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    slug: string;

    @Column()
    content: string;

    @Column()
    coverImage: string;

    @Column({
        type: 'enum',
        enum: PostStatus,
        default: PostStatus.DRAFT
    })
    status: PostStatus;

    @Column({ default: 0 })
    views: number;

    @ManyToOne(() => User, (user) => user.posts)
    author: User;

    @ManyToOne(() => Category, (category) => category.posts)
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}