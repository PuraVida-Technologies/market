import { InputType, Field } from '@nestjs/graphql';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { POST_STATUS } from '../../../common/constants';

@InputType()
export class ApproveOrDeclinePostInput {
  @Field(() => POST_STATUS, { description: 'This is the status of the Post' })
  @IsNotEmpty()
  @IsEnum(POST_STATUS, {
    message: `status must be on these values: ${POST_STATUS.APPROVED}, ${POST_STATUS.DECLINED}, ${POST_STATUS.PENDING}`,
  })
  status: POST_STATUS;

  @Field(() => String, { description: 'This is the post id' })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
