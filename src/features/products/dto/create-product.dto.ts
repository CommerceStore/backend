import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { ProductCategory } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: '애플 맥북 프로 14인치' })
  @IsString()
  name: string;

  @ApiProperty({ example: '최신형 M3 프로세서 탑재' })
  @IsString()
  description: string;

  @ApiProperty({ example: 2490000 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 2990000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  originalPrice?: number;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({ enum: ProductCategory, example: ProductCategory.ELECTRONICS })
  @IsEnum(ProductCategory)
  category: ProductCategory;
}
