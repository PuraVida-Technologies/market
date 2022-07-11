import { Test, TestingModule } from '@nestjs/testing';
import { UserRatePostResolver } from './user-rate-post.resolver';
import { UserRatePostService } from './user-rate-post.service';

describe('UserRatePostResolver', () => {
  let resolver: UserRatePostResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserRatePostResolver, UserRatePostService],
    }).compile();

    resolver = module.get<UserRatePostResolver>(UserRatePostResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
