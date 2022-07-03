import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, Post } from '../../models';
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

    const category = await this.categoryModel
      .findOne({
        isDeleted: false,
        _id: categoryId,
      })
      .lean();

    if (!category) {
      throw new NotFoundException('the category does not exists');
    }

    const post = {
      ...createMarketplacePostInput,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },

      ownerInfo: {
        phoneNumber,
        email,
      },

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

  remove(id: number) {
    return `This action removes a #${id} marketplacePost`;
  }
}
