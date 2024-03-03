import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponse {
  @ApiProperty({ type: String })
  @Expose()
  _id: string;

  @ApiProperty({ type: String })
  @Expose()
  username: string;

  @ApiProperty({ type: String })
  @Expose()
  name: string;

  @ApiProperty({ type: String })
  password: string;
}
