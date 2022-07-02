import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class AdminCategory {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
