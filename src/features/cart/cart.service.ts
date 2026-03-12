import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async getCart(userId: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.product'],
    });

    if (!cart) {
      throw new NotFoundException('장바구니를 찾을 수 없습니다.');
    }

    return cart;
  }

  async addItem(userId: number, dto: AddCartItemDto): Promise<CartItem> {
    const cart = await this.getCart(userId);

    await this.productsService.findOne(dto.productId);

    const existing = await this.cartItemRepository.findOne({
      where: { cartId: cart.id, productId: dto.productId },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartItemRepository.save(existing);
    }

    const item = this.cartItemRepository.create({
      cartId: cart.id,
      productId: dto.productId,
      quantity: dto.quantity,
    });

    return this.cartItemRepository.save(item);
  }

  async updateItem(
    userId: number,
    itemId: number,
    dto: UpdateCartItemDto,
  ): Promise<CartItem | void> {
    const cart = await this.getCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('장바구니 항목을 찾을 수 없습니다.');
    }

    if (dto.quantity === 0) {
      await this.cartItemRepository.remove(item);
      return;
    }

    item.quantity = dto.quantity;
    return this.cartItemRepository.save(item);
  }

  async removeItem(userId: number, itemId: number): Promise<void> {
    const cart = await this.getCart(userId);
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      throw new NotFoundException('장바구니 항목을 찾을 수 없습니다.');
    }

    await this.cartItemRepository.remove(item);
  }

  async clearCart(userId: number): Promise<void> {
    const cart = await this.getCart(userId);
    await this.cartItemRepository.delete({ cartId: cart.id });
  }
}
