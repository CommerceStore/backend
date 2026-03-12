import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  findAllUsers() {
    return this.usersService.findAll();
  }

  findUserById(id: number) {
    return this.usersService.findById(id);
  }

  findAllProducts() {
    return this.productsService.findAll({});
  }

  createProduct(dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  updateProduct(id: number, dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  removeProduct(id: number) {
    return this.productsService.remove(id);
  }
}
