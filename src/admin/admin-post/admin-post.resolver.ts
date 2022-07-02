import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminPostService } from './admin-post.service';
import { AdminPost } from './entities/admin-post.entity';
import { CreateAdminPostInput } from './dto/create-admin-post.input';
import { UpdateAdminPostInput } from './dto/update-admin-post.input';

@Resolver(() => AdminPost)
export class AdminPostResolver {
  constructor(private readonly adminPostService: AdminPostService) {}

  @Mutation(() => AdminPost)
  createAdminPost(@Args('createAdminPostInput') createAdminPostInput: CreateAdminPostInput) {
    return this.adminPostService.create(createAdminPostInput);
  }

  @Query(() => [AdminPost], { name: 'adminPost' })
  findAll() {
    return this.adminPostService.findAll();
  }

  @Query(() => AdminPost, { name: 'adminPost' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminPostService.findOne(id);
  }

  @Mutation(() => AdminPost)
  updateAdminPost(@Args('updateAdminPostInput') updateAdminPostInput: UpdateAdminPostInput) {
    return this.adminPostService.update(updateAdminPostInput.id, updateAdminPostInput);
  }

  @Mutation(() => AdminPost)
  removeAdminPost(@Args('id', { type: () => Int }) id: number) {
    return this.adminPostService.remove(id);
  }
}
