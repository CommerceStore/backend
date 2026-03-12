import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @ApiPropertyOptional({ description: '변경할 이름' })
  @IsOptional()
  @IsString()
  name?: string;
}
