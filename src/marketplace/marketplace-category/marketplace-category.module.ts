import { Module } from '@nestjs/common';
import { MarketplaceCategoryService } from './marketplace-category.service';
import { MarketplaceCategoryResolver } from './marketplace-category.resolver';

@Module({
  providers: [MarketplaceCategoryResolver, MarketplaceCategoryService]
})
export class MarketplaceCategoryModule {}
