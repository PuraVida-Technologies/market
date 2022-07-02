import { Injectable } from '@nestjs/common';
import { CreateAdminCategoryInput } from './dto/create-admin-category.input';
import { UpdateAdminCategoryInput } from './dto/update-admin-category.input';

@Injectable()
export class AdminCategoryService {
  create(createAdminCategoryInput: CreateAdminCategoryInput) {
    return 'This action adds a new adminCategory';
  }

  findAll() {
    return `This action returns all adminCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminCategory`;
  }

  update(id: number, updateAdminCategoryInput: UpdateAdminCategoryInput) {
    return `This action updates a #${id} adminCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminCategory`;
  }
}
