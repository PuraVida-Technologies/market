import { CreateAdminPostInput } from './create-admin-post.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAdminPostInput extends PartialType(CreateAdminPostInput) {
  @Field(() => Int)
  id: number;
}
