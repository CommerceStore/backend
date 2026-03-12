import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: '사용자 목록 조회' })
  @Get('users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @ApiOperation({ summary: '사용자 상세 조회' })
  @Get('users/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findUserById(id);
  }

  @ApiOperation({ summary: '상품 목록 조회' })
  @Get('products')
  findAllProducts() {
    return this.adminService.findAllProducts();
  }

  @ApiOperation({ summary: '상품 등록' })
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @ApiOperation({ summary: '상품 수정' })
  @Put('products/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.adminService.updateProduct(id, dto);
  }

  @ApiOperation({ summary: '상품 삭제' })
  @Delete('products/:id')
  removeProduct(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.removeProduct(id);
  }
}
