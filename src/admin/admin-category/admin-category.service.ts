import { ConflictException, Injectable } from '@nestjs/common';
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
    const category = await this.categoryModel.findOne({
      name: createAdminCategoryInput.name,
      isDeleted: false,
    });

    if (category) {
      throw new ConflictException('Category with this name already exist');
    }

    return this.categoryModel.create(createAdminCategoryInput);
  }

  async findAll() {
    return this.categoryModel.find({ isDeleted: false });
  }

  async findOne(id: string) {
    return this.categoryModel.findOne({ _id: id, isDeleted: false });
  }

  update(id: number, updateAdminCategoryInput: UpdateAdminCategoryInput) {
    return `This action updates a #${id} adminCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminCategory`;
  }
}
