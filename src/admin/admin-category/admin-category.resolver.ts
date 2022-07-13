import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminCategoryService } from './admin-category.service';
import { AdminCategory } from './entities/admin-category.entity';
import { CreateAdminCategoryInput } from './dto/create-admin-category.input';
import { UpdateAdminCategoryInput } from './dto/update-admin-category.input';
import { GetAllDto } from '../../common/inputs/get-all.input';

@Resolver(() => AdminCategory)
export class AdminCategoryResolver {
  constructor(private readonly adminCategoryService: AdminCategoryService) {}

  @Mutation(() => AdminCategory)
  createAdminCategory(
    @Args('createAdminCategoryInput')
    createAdminCategoryInput: CreateAdminCategoryInput,
  ) {
    return this.adminCategoryService.create(createAdminCategoryInput);
  }

  @Query(() => [AdminCategory])
  getAdminCategories(
    @Args('getAdminCategoriesInput')
    getAdminCategoriesInput?: GetAllDto,
  ) {
    return this.adminCategoryService.findAll(getAdminCategoriesInput);
  }

@Query(() => AdminCategory, { name: 'getAdminCategory' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.adminCategoryService.findOne(id);
  }

  @Mutation(() => AdminCategory)
  updateAdminCategory(
    @Args('id')
    id: string,

    @Args('updateAdminCategoryInput')
    updateAdminCategoryInput: UpdateAdminCategoryInput,
  ) {
    return this.adminCategoryService.update(id, updateAdminCategoryInput);
  }

  @Mutation(() => AdminCategory)
  removeAdminCategory(@Args('id', { type: () => String }) id: string) {
    return this.adminCategoryService.remove(id);
  }
}
