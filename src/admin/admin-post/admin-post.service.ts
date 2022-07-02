import { Injectable } from '@nestjs/common';
import { CreateAdminPostInput } from './dto/create-admin-post.input';
import { UpdateAdminPostInput } from './dto/update-admin-post.input';

@Injectable()
export class AdminPostService {
  create(createAdminPostInput: CreateAdminPostInput) {
    return 'This action adds a new adminPost';
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
