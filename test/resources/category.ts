import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { Category } from '../../src/models';

export const generateCategory = () => {
  const category = new Category();

  category._id = new mongoose.Types.ObjectId().toString();
  category.name = faker.name.title();

  return category;
};
