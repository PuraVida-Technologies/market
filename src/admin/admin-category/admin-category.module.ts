import { Module } from '@nestjs/common';
import { AdminCategoryService } from './admin-category.service';
import { AdminCategoryResolver } from './admin-category.resolver';
import { MongooseModule } from '@nestjs/mongoose';
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
  providers: [AdminCategoryResolver, AdminCategoryService],
  exports: [AdminCategoryService],
})
export class AdminCategoryModule {}
