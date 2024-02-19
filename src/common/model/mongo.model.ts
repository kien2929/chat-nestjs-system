import { ApiProperty } from '@nestjs/swagger';

export class DocumentBase {
  @ApiProperty({ type: String })
  _id: string;

  @ApiProperty({ type: Number })
  __v: number;
}
