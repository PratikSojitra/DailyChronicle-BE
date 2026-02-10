import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('postViews')
export class PostView {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.views, { onDelete: 'CASCADE' })
  post: Post;

  @Column({ nullable: true })
  userIp: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  viewer: User;

  @CreateDateColumn()
  createdAt: Date;
}
