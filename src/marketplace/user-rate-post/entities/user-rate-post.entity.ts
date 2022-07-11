import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserRatePost {
  @Field(() => String, { description: 'This is user rate for post  id' })
  _id: string;

  @Field(() => String, { description: 'This is user id' })
  userId: string;

  @Field(() => String, { description: 'This is post id' })
  postId: string;

  @Field(() => Number, { description: 'This is post rate value' })
  value: number;

  @Field(() => String, { description: 'This is the created time for post ' })
  createdAt: string;

  @Field(() => String, { description: 'This is the updated time for post ' })
  updatedAt: string;
}
