import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MarketplaceCategory {
  @Field(() => String, { description: 'This is the category name' })
  name: string;

  @Field(() => String, { description: 'This is the category id' })
  _id: string;
}
