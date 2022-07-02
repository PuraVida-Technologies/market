import { Module } from '@nestjs/common';
import { MarketplacePostService } from './marketplace-post.service';
import { MarketplacePostResolver } from './marketplace-post.resolver';

@Module({
  providers: [MarketplacePostResolver, MarketplacePostService]
})
export class MarketplacePostModule {}
