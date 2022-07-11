import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { UserRatePostService } from './user-rate-post.service';
import { UserRatePost } from './entities/user-rate-post.entity';
import { CreateUserRatingPostInput } from './dto/create-user-rate-post.input';

@Resolver(() => UserRatePost)
export class UserRatePostResolver {
  constructor(private readonly userRatePostService: UserRatePostService) {}

  @Mutation(() => UserRatePost)
  createUserRatingPost(
    @Args('createUserRatingPostInput')
    createUserRatePostInput: CreateUserRatingPostInput,
  ) {
    return this.userRatePostService.create(createUserRatePostInput);
  }

  @Mutation(() => UserRatePost)
  removeUserRatePost(@Args('id', { type: () => Int }) id: number) {
    return this.userRatePostService.remove(id);
  }
}
