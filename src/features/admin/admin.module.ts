import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [UsersModule, ProductsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
