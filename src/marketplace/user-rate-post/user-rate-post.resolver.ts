import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UserRatePostService } from './user-rate-post.service';
import { UserRatePost } from './entities/user-rate-post.entity';
import { CreateUserRatePostInput } from './dto/create-user-rate-post.input';

@Resolver(() => UserRatePost)
export class UserRatePostResolver {
  constructor(private readonly userRatePostService: UserRatePostService) {}

  @Mutation(() => UserRatePost)
  createUserRatePost(
    @Args('createUserRatePostInput')
    createUserRatePostInput: CreateUserRatePostInput,
  ) {
    return this.userRatePostService.create(createUserRatePostInput);
  }

  @Mutation(() => UserRatePost)
  removeUserRatePost(@Args('id', { type: () => String }) id: string) {
    return this.userRatePostService.remove(id);
  }
}
