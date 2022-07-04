import * as faker from 'faker';
import * as mongoose from 'mongoose';
import { POST_STATUS } from '../../src/common/constants';
import { Post } from '../../src/models';

export const generatePost = () => {
  const post = new Post();

  const images = [];

  for (let index = 0; index < 5; index++) {
    images.push(faker.image.animals());
  }

  post._id = new mongoose.Types.ObjectId().toString();
  post.name = faker.datatype.string(10);
  post.description = faker.datatype.string(100);
  post.mainImageUrl = faker.image.avatar();
  post.imagesUrls = images;
  post.address = faker.datatype.string(15);
  post.location = {
    coordinates: [+faker.address.longitude(), +faker.address.latitude()],
    type: 'Point',
  };

  post.ownerInfo = {
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    isEmailVerified: false,
    isPhoneVerified: false,
  };

  post.userId = new mongoose.Types.ObjectId().toString();
  post.price = faker.datatype.number();
  post.status = POST_STATUS.PENDING;
  post.openHours = faker.datatype.string(20);

  return post;
};
