import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AdminCategory {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Boolean)
  isDeleted: boolean;
}
