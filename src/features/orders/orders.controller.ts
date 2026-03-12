import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: '주문 목록 조회 (어드민: 전체, 유저: 본인)' })
  @Get()
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user.id, user.role);
  }

  @ApiOperation({ summary: '주문 상세 조회' })
  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(user.id, id, user.role);
  }

  @ApiOperation({ summary: '주문 생성' })
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @ApiOperation({ summary: '주문 취소 (PENDING/CONFIRMED 상태만)' })
  @Patch(':id/cancel')
  cancel(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancelOrder(user.id, id);
  }

  @ApiOperation({ summary: '주문 상태 변경 (어드민)' })
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }
}
