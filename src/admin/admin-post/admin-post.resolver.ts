import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminPostService } from './admin-post.service';
import { AdminPost } from './entities/admin-post.entity';
import { ApproveOrDeclinePostInput } from './dto/approve-or-decline-post.input';
import { GetAllDto } from '../../common/inputs/get-all.input';

@Resolver(() => AdminPost)
export class AdminPostResolver {
  constructor(private readonly adminPostService: AdminPostService) { }

  @Mutation(() => AdminPost)
  approveOrDeclinePost(
    @Args('approveOrDeclinePostInput')
    approveOrDeclinePostInput: ApproveOrDeclinePostInput,
  ) {
    return this.adminPostService.approveOrDecline(approveOrDeclinePostInput);
  }

  @Query(() => [AdminPost])
  getAdminPosts(
    @Args('getAdminPostsInput')
    getAdminPostsInput?: GetAllDto,
  ) {
    return this.adminPostService.findAll(getAdminPostsInput);
  }

  @Query(() => AdminPost, { name: 'getAdminPost' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.adminPostService.findOne(id);
  }

  @Mutation(() => AdminPost)
  removeAdminPost(@Args('id', { type: () => String }) id: string) {
    return this.adminPostService.remove(id);
  }
}
