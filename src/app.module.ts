import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Post } from './entities/post.entity';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'db.ajjfqxqandoklcjwkctm.supabase.co',
      // port:5432,
      // username: 'postgres',
      // password: 'Sokitra@2000',
      // database: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [User, Category, Post],
      synchronize: true,
    }),
    AuthModule,
    CategoryModule,
    PostModule,
    UserModule,
    NewsletterModule,
    EventEmitterModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // or smtp.sendgrid.net
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_ADDRESS, // Your real email
          pass: process.env.EMAIL_PASSWORD, // The 16-char App Password
        },
      },
      defaults: {
        from: '"Daily Chronicle" <noreply@dailychronicle.com>',
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
