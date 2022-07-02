import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MarketplacePost {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
