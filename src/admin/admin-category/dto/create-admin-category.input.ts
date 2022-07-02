import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminCategoryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
