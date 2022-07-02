import { Module } from '@nestjs/common';
import { AdminCategoryService } from './admin-category.service';
import { AdminCategoryResolver } from './admin-category.resolver';

@Module({
  providers: [AdminCategoryResolver, AdminCategoryService]
})
export class AdminCategoryModule {}
