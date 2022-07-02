import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ timestamps: true })
@ObjectType()
export class UserRatePost extends Document {
  @Field()
  _id: string;

  @Field()
  @Prop()
  userId: string;

  @Field(() => String)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  })
  postId: string;

  @Field()
  @Prop()
  value: number;

  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const UserRatePostSchema = SchemaFactory.createForClass(UserRatePost);
UserRatePostSchema.index({ userId: 1, postId: 1 });
