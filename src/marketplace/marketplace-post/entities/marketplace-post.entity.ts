import { ObjectType, Field } from '@nestjs/graphql';
import { POST_STATUS } from '../../../common/constants';

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

  @Field(() => POST_STATUS)
  status: POST_STATUS;

  @Field()
  openHours: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Number, { nullable: true })
  rating: number;
}
