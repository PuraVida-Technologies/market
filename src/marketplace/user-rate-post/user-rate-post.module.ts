import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRatePostService } from './user-rate-post.service';
import { UserRatePostResolver } from './user-rate-post.resolver';
import {
  Post,
  PostSchema,
  UserRatePost,
  UserRatePostSchema,
} from '../../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: UserRatePost.name,
        schema: UserRatePostSchema,
      },
    ]),
  ],
  providers: [UserRatePostResolver, UserRatePostService],
  exports: [UserRatePostService],
})
export class UserRatePostModule {}
