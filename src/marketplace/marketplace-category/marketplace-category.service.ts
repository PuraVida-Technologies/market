import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetAllDto } from '../../common/inputs/get-all.input';
import { CATEGORY_NAMES_INDEX } from '../../common/constants';
import { mongoTextSearch } from '../../common/helpers';
import { Category } from '../../models';
import { AutoCompleteCategoryInput } from './dto/auto-complete.input';

@Injectable()
export class MarketplaceCategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  findAll(getMarketPlaceCategoriesInput: GetAllDto) {
    const { limit, order, page, sortBy } = getMarketPlaceCategoriesInput;

    return this.categoryModel
      .find({ isDeleted: false })
      .sort({ [sortBy]: order })
      .skip(page * limit - limit)
      .limit(limit)
      .lean();
  }

  findOne(id: string) {
    return this.categoryModel.findOne({ _id: id, isDeleted: false });
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
