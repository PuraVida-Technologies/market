import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Post } from '../../models';
import { ApproveOrDeclinePostInput } from './dto/approve-or-decline-post.input';
import { CreateAdminPostInput } from './dto/create-admin-post.input';
import { UpdateAdminPostInput } from './dto/update-admin-post.input';

@Injectable()
export class AdminPostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  create(createAdminPostInput: CreateAdminPostInput) {
    return 'This action adds a new adminPost';
  }

  async approveOrDecline(approveOrDeclinePostInput: ApproveOrDeclinePostInput) {
    const { status, postId } = approveOrDeclinePostInput;

    const post = await this.postModel.findOneAndUpdate(
      { isDeleted: false, _id: postId },
      { $set: { status } },
      { new: true, lean: true },
    );

    if (!post) {
      throw new NotFoundException('This post is not exists');
    }

    return post;
  }

  findAll() {
    return `This action returns all adminPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminPost`;
  }

  update(id: number, updateAdminPostInput: UpdateAdminPostInput) {
    return `This action updates a #${id} adminPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminPost`;
  }
}
