import { Location, Owner } from '../../models';

export const createPostFormat = (post: any) => {
  const { longitude, latitude, phoneNumber, email } = post;

  const ownerInfo: Owner = {
    phoneNumber,
    email,
  };

  let location: Location;

  if (longitude && latitude) {
    location = {
      type: 'Point',
      coordinates: [longitude, latitude],
    };
  }

  return {
    ...post,
    location,
    ownerInfo,
  };
};
