import { Injectable } from '@nestjs/common';
import { CreateMarketplaceCategoryInput } from './dto/create-marketplace-category.input';
import { UpdateMarketplaceCategoryInput } from './dto/update-marketplace-category.input';

@Injectable()
export class MarketplaceCategoryService {
  create(createMarketplaceCategoryInput: CreateMarketplaceCategoryInput) {
    return 'This action adds a new marketplaceCategory';
  }

  findAll() {
    return `This action returns all marketplaceCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketplaceCategory`;
  }

  update(
    id: number,
    updateMarketplaceCategoryInput: UpdateMarketplaceCategoryInput,
  ) {
    return `This action updates a #${id} marketplaceCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketplaceCategory`;
  }
}
