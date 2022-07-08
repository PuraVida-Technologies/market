import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Location, Owner, Post } from '../../models';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';

@Injectable()
export class MarketplacePostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}
  async create(createMarketplacePostInput: CreateMarketplacePostInput) {
    const { longitude, latitude, phoneNumber, email, categoryId } =
      createMarketplacePostInput;

    const category: Category = await this.categoryModel
      .findOne({
        isDeleted: false,
        _id: categoryId,
      })
      .lean();

    if (!category) {
      throw new NotFoundException('the category does not exists');
    }

    const ownerInfo: Owner = {
      phoneNumber,
      email,
    };

    const location: Location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };

    const post = {
      ...createMarketplacePostInput,
      location,
      ownerInfo,
      category,
    };

    return this.postModel.create(post);
  }

  findAll() {
    return `This action returns all marketplacePost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketplacePost`;
  }

  update(id: number, updateMarketplacePostInput: UpdateMarketplacePostInput) {
    return `This action updates a #${id} marketplacePost`;
  }

  async remove(id: string) {
    const deletedPost = await this.postModel.findOneAndUpdate(
      { _id: id },
      { $set: { isDeleted: true } },
      { new: true, lean: true },
    );

    if (!deletedPost) {
      throw new NotFoundException('This post is not exists');
    }

    return deletedPost;
  }
}
