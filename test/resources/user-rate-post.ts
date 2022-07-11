import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { UserRatePost } from '../../src/models';

export const generateUserPostRate = () => {
  const userPostRate = new UserRatePost();

  userPostRate._id = new mongoose.Types.ObjectId().toString();
  userPostRate.postId = new mongoose.Types.ObjectId().toString();
  userPostRate.categoryId = new mongoose.Types.ObjectId().toString();
  userPostRate.userId = new mongoose.Types.ObjectId().toString();
  userPostRate.description = faker.lorem.paragraph(30);
  userPostRate.value = faker.datatype.number(5);

  return userPostRate;
};
