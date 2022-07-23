import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Post } from './post.schema';
import { BaseRepository } from '../../common/interface';

@Injectable()
export class PostRepository implements Partial<BaseRepository> {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getOne<Post>(_id: string): Promise<Document<Post, any, any>> {
    return this.postModel.findOne({ isDeleted: false, _id }).lean();
  }
}
