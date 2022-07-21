import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Media {
  @Field(() => String, { description: 'This is the file url' })
  url: string;
}
