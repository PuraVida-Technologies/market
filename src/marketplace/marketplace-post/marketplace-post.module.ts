import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplacePostService } from './marketplace-post.service';
import { MarketplacePostResolver } from './marketplace-post.resolver';
import {
  Category,
  CategorySchema,
  Post,
  PostSchema,
  UserRatePost,
  UserRatePostSchema,
  PostRepository,
} from '../../models';

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
      {
        name: UserRatePost.name,
        schema: UserRatePostSchema,
      },
    ]),
  ],
  providers: [MarketplacePostResolver, MarketplacePostService, PostRepository],
  exports: [MarketplacePostService], //this for deps injection
})
export class MarketplacePostModule {}
