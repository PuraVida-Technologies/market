import { Module } from '@nestjs/common';
import { MarketplacePostModule } from './marketplace-post/marketplace-post.module';
import { MarketplaceCategoryModule } from './marketplace-category/marketplace-category.module';

@Module({
  imports: [MarketplacePostModule, MarketplaceCategoryModule],
})
export class MarketplaceModule {}
