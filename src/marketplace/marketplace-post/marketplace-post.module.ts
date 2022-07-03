import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplacePostService } from './marketplace-post.service';
import { MarketplacePostResolver } from './marketplace-post.resolver';
import { Post, PostSchema } from '../../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
  ],
  providers: [MarketplacePostResolver, MarketplacePostService],
  exports: [MarketplacePostService], //this for deps injection
})
export class MarketplacePostModule {}
