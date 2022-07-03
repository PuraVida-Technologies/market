import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MarketplacePost {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => String)
  categoryId: string;

  @Field()
  description: string;

  @Field()
  mainImageUrl: string;

  @Field(() => [String])
  imagesUrls: string[];

  @Field()
  address: string;

  @Field()
  userId: string;

  @Field()
  price: number;

  @Field()
  status: string;

  @Field()
  openHours: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
