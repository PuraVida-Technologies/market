import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminPostInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
