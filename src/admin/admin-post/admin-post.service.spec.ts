import { Test, TestingModule } from '@nestjs/testing';
import { AdminPostService } from './admin-post.service';

describe('AdminPostService', () => {
  let service: AdminPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminPostService],
    }).compile();

    service = module.get<AdminPostService>(AdminPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
