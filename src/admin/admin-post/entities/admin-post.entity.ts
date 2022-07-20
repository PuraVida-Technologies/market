import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { POST_STATUS } from '../../../common/constants';

registerEnumType(POST_STATUS, {
  name: 'POST_STATUS',
});

@ObjectType()
export class AdminPost {
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
}
