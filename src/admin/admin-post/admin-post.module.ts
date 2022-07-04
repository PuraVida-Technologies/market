import { Module } from '@nestjs/common';
import { AdminPostService } from './admin-post.service';
import { AdminPostResolver } from './admin-post.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema, Post, PostSchema } from '../../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  providers: [AdminPostResolver, AdminPostService],
  exports: [AdminPostService], //this for deps injection
})
export class AdminPostModule {}
