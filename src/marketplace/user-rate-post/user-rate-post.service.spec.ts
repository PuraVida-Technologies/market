import { Test, TestingModule } from '@nestjs/testing';
import { UserRatePostService } from './user-rate-post.service';

describe('UserRatePostService', () => {
  let service: UserRatePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRatePostService],
    }).compile();

    service = module.get<UserRatePostService>(UserRatePostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
