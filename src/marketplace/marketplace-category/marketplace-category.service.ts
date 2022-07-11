import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CATEGORY_NAMES_INDEX } from '../../common/constants';
import { mongoTextSearch } from '../../common/helpers';
import { Category } from '../../models';
import { AutoCompleteCategoryInput } from './dto/auto-complete.input';

@Injectable()
export class MarketplaceCategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  findAll() {
    return `This action returns all marketplaceCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketplaceCategory`;
  }

  async autoComplete(autoCompleteCategoryInput: AutoCompleteCategoryInput) {
    const { name } = autoCompleteCategoryInput;

    const categories = await this.categoryModel.aggregate([
      ...mongoTextSearch({
        field: 'name',
        index: CATEGORY_NAMES_INDEX,
        query: name,
      }),
      { $limit: 10 },
    ]);

    return categories;
  }
}
