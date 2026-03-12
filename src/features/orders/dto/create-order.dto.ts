import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class ShippingAddressDto {
  @ApiProperty({ example: '홍길동' })
  @IsString()
  recipientName: string;

  @ApiProperty({ example: '010-1234-5678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '06000' })
  @IsString()
  zipCode: string;

  @ApiProperty({ example: '서울특별시 강남구 테헤란로 123' })
  @IsString()
  address: string;

  @ApiProperty({ example: '456호' })
  @IsString()
  addressDetail: string;

  @ApiPropertyOptional({ example: '문 앞에 놓아주세요' })
  @IsOptional()
  @IsString()
  deliveryRequest?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
