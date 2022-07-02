import { Test, TestingModule } from '@nestjs/testing';
import { AdminCategoryResolver } from './admin-category.resolver';
import { AdminCategoryService } from './admin-category.service';

describe('AdminCategoryResolver', () => {
  let resolver: AdminCategoryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminCategoryResolver, AdminCategoryService],
    }).compile();

    resolver = module.get<AdminCategoryResolver>(AdminCategoryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
