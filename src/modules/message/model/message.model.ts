import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DocumentBase } from 'src/common/model/mongo.model';

export class MessageModelResponse extends DocumentBase {
  @ApiProperty({ type: String })
  @Expose()
  messageFrom: string;

  @ApiProperty({ type: String })
  @Expose()
  messageTo: string;

  @ApiProperty({ type: String })
  @Expose()
  content: string;

  @ApiProperty({ type: Date })
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: Number })
  @Expose()
  type: number;
}
