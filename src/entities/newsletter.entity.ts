import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";
import { Subscriber } from "./subscriber.entity";

@Entity('newsletters')

export class Newsletter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    coverImage: string;

    @ManyToMany(() => Post)
    posts: Post[];

    @ManyToMany(() => Subscriber)
    subscribers: Subscriber[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}