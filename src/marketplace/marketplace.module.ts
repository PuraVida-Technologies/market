import { Module } from '@nestjs/common';
import { MarketplacePostModule } from './marketplace-post/marketplace-post.module';
import { MarketplaceCategoryModule } from './marketplace-category/marketplace-category.module';
import { UserRatePostModule } from './user-rate-post/user-rate-post.module';

@Module({
  imports: [
    MarketplacePostModule,
    MarketplaceCategoryModule,
    UserRatePostModule,
  ],
})
export class MarketplaceModule {}
