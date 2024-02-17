import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsInt } from 'class-validator';

export class GetPagingMessageQueryDto {
  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 20 })
  pageSize = 20;

  @IsInt()
  @Type(() => Number)
  @ApiPropertyOptional({ type: Number, default: 0 })
  pageNumber = 0;

  @IsString()
  @ApiProperty({ type: String })
  messageFrom: string;

  @IsString()
  @ApiProperty({ type: String })
  messageTo: string;
}

export class CreateMessageDto {
  @IsString()
  @ApiProperty({ type: String })
  messageFrom: string;

  @IsString()
  @ApiProperty({ type: String })
  messageTo: string;

  @IsString()
  @ApiProperty({ type: String })
  content: string;
}
