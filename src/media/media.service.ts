import { Injectable } from '@nestjs/common';
import { UserInputError } from 'apollo-server-core';
import { FileUpload } from 'graphql-upload';
import {
  checkFileSize,
  generateUniqueFilename,
  uploadToGoogleCloud,
} from './file.helper';

@Injectable()
export class MediaService {
  async create(
    createReadStream: FileUpload['createReadStream'],
    filename: string,
  ) {
    const uniqueFilename = generateUniqueFilename(filename);

    try {
      const fileMaxSize = 1024 * 1024 * 25; // 25MB
      await checkFileSize(createReadStream, fileMaxSize);

      await uploadToGoogleCloud(createReadStream, uniqueFilename);
    } catch (error) {
      throw new UserInputError('Error with uploading to Google Cloud');
    }

    return `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${uniqueFilename}`;
  }
}
