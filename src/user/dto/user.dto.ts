import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  username: string;

  @ApiProperty({ type: String, minLength: 8, maxLength: 22 })
  @IsString()
  @MinLength(8)
  @MaxLength(22)
  password: string;
}
