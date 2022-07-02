import { Module } from '@nestjs/common';
import { AdminPostService } from './admin-post.service';
import { AdminPostResolver } from './admin-post.resolver';

@Module({
  providers: [AdminPostResolver, AdminPostService]
})
export class AdminPostModule {}
