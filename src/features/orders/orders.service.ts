import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { UserRole } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const itemsToCreate: Partial<OrderItem>[] = [];

      for (const item of dto.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `상품(ID: ${item.productId})을 찾을 수 없습니다.`,
          );
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `상품 "${product.name}"의 재고가 부족합니다.`,
          );
        }

        totalAmount += product.price * item.quantity;
        itemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtOrder: product.price,
        });

        product.stock -= item.quantity;
        await manager.save(product);
      }

      const shippingFee = totalAmount >= 50000 ? 0 : 3000;

      const order = manager.create(Order, {
        userId,
        totalAmount,
        shippingFee,
        shippingAddress: dto.shippingAddress,
      });
      const savedOrder = await manager.save(order);

      const orderItems = itemsToCreate.map((item) =>
        manager.create(OrderItem, { ...item, orderId: savedOrder.id }),
      );
      await manager.save(orderItems);

      return manager.findOne(Order, {
        where: { id: savedOrder.id },
        relations: ['items', 'items.product'],
      }) as Promise<Order>;
    });
  }

  async cancelOrder(userId: number, orderId: number): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id: orderId },
        relations: ['items'],
      });

      if (!order) {
        throw new NotFoundException('주문을 찾을 수 없습니다.');
      }
      if (order.userId !== userId) {
        throw new ForbiddenException('접근 권한이 없습니다.');
      }
      if (
        order.status !== OrderStatus.PENDING &&
        order.status !== OrderStatus.CONFIRMED
      ) {
        throw new BadRequestException('취소 가능한 주문 상태가 아닙니다.');
      }

      for (const item of order.items) {
        const product = await manager.findOne(Product, {
          where: { id: item.productId },
        });
        if (product) {
          product.stock += item.quantity;
          await manager.save(product);
        }
      }

      order.status = OrderStatus.CANCELLED;
      return manager.save(order);
    });
  }

  async updateStatus(
    orderId: number,
    dto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  async findAll(userId: number, role: UserRole): Promise<Order[]> {
    const where = role === UserRole.ADMIN ? {} : { userId };
    return this.orderRepository.find({
      where,
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(
    userId: number,
    orderId: number,
    role: UserRole,
  ): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('주문을 찾을 수 없습니다.');
    }
    if (role !== UserRole.ADMIN && order.userId !== userId) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return order;
  }
}
