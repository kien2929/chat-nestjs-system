import { Request } from '@nestjs/common';

export interface JwtRequest extends Request {
  jwt?: string;
}
