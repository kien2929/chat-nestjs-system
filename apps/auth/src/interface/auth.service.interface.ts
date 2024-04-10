import { UserEntity } from '@app/shared';
import {
  CreateUserDto,
  LoginDto,
} from 'apps/api/src/modules/user/dto/user.dto';

export interface AuthServiceInterface {
  getUsers();
  findByEmail(email: string): Promise<UserEntity>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hashedPassword: string): Promise<boolean>;
  validUser(email: string, password: string): Promise<boolean>;
  generateJwt(payload): Promise<string>;
  registerUser(user: Readonly<CreateUserDto>): Promise<UserEntity>;
  login(loginPayload: LoginDto): Promise<{ token: string }>;
  verifyJwt(jwt: string): Promise<{ user: UserEntity }>;
}
