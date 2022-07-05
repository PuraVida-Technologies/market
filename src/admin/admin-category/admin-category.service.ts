import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../../models';
import { Model } from 'mongoose';
import { CreateAdminCategoryInput } from './dto/create-admin-category.input';
import { UpdateAdminCategoryInput } from './dto/update-admin-category.input';

@Injectable()
export class AdminCategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async create(
    createAdminCategoryInput: CreateAdminCategoryInput,
  ): Promise<Category> {
    const category = new this.categoryModel(createAdminCategoryInput);
    return this.categoryModel.create(category);
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
