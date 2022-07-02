import { Injectable } from '@nestjs/common';
import { CreateMarketplacePostInput } from './dto/create-marketplace-post.input';
import { UpdateMarketplacePostInput } from './dto/update-marketplace-post.input';

@Injectable()
export class MarketplacePostService {
  create(createMarketplacePostInput: CreateMarketplacePostInput) {
    return 'This action adds a new marketplacePost';
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
