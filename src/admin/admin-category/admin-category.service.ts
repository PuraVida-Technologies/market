import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    });
    console.log(category);

    if (category) {
      throw new ConflictException('Category already exist');
    }

    return await this.categoryModel.create(createAdminCategoryInput);
  }

  async findAll() {
    return await this.categoryModel.find();
  }

  async findOne(id: string) {
    return await this.categoryModel.findOne({ _id: id });
  }

  update(id: number, updateAdminCategoryInput: UpdateAdminCategoryInput) {
    return `This action updates a #${id} adminCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminCategory`;
  }
}
