import { Test, TestingModule } from '@nestjs/testing';
import { AdminPostResolver } from './admin-post.resolver';
import { AdminPostService } from './admin-post.service';

describe('AdminPostResolver', () => {
  let resolver: AdminPostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPostResolver, AdminPostService],
    }).compile();

    resolver = module.get<AdminPostResolver>(AdminPostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
