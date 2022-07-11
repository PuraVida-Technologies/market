import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceCategoryService } from './marketplace-category.service';
import { MarketplaceCategoryResolver } from './marketplace-category.resolver';
import { Category, CategorySchema } from '../../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
  ],
  providers: [MarketplaceCategoryResolver, MarketplaceCategoryService],
  exports: [MarketplaceCategoryService], //this for deps injection
})
export class MarketplaceCategoryModule {}
