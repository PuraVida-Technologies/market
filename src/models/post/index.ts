import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { postConstants } from '../../common/constants';
import { Category } from '../category';

@Schema({ _id: false, timestamps: false })
export class Location {
  @Field()
  @Prop({ type: String, enum: ['Point'] })
  type: string;

  @Field(() => [Number])
  @Prop([Number, Number])
  coordinates: [number, number];
}

@Schema({ _id: false, timestamps: false })
export class Owner {
  @Field()
  @Prop()
  phoneNumber: string;

  @Field()
  @Prop({ default: false })
  isPhoneVerified?: boolean;

  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop({ default: false })
  isEmailVerified?: boolean;
}

@Schema({ timestamps: true })
@ObjectType()
export class Post {
  @Field()
  _id: string;

  @Field()
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  categoryId: string;

  @Field()
  @Prop({ type: Category })
  category: Category;

  @Field()
  @Prop()
  description: string;

  @Field()
  @Prop()
  mainImageUrl: string;

  @Field(() => [String])
  @Prop([String])
  imagesUrls: string[];

  @Field()
  @Prop()
  address: string;

  @Field()
  @Prop({ type: Location })
  location: Location;

  @Field()
  @Prop({ type: Owner })
  ownerInfo: Owner;

  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  price: number;

  @Field()
  @Prop({
    enum: postConstants.POST_STATUS,
    default: postConstants.POST_STATUS.PENDING_STATUS,
  })
  status: string;

  @Field()
  @Prop()
  openHours: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({ location: '2dsphere' });
