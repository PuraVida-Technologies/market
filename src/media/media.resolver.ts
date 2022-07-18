import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';
import { MediaService } from './media.service';
import { Media } from './entities/media.entity';
import { FileArgs } from './types';

@Resolver(() => Media)
export class MediaResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Mutation(() => Media)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    args: FileArgs,
  ) {
    const { filename, createReadStream } = await args.file;

    return this.mediaService.create(createReadStream, filename);
  }
}
