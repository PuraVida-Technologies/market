import * as mongoose from 'mongoose';

export interface BaseRepository {
  getOne<T>(id: string): Promise<mongoose.Document<T>>;
}
