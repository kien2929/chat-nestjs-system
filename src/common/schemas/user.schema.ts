import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  login: (user: User, password: string) => Promise<object>;

  validatePassword: (password: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next: any) {
  const userExisted = await this.model('User')
    .findOne({ username: this.username })
    .exec();
  this.password = await bcrypt.hashSync(this.password, 10);
  if (userExisted) {
    throw new HttpException('Username already existed', HttpStatus.BAD_REQUEST);
  }
  next();
});

UserSchema.methods.validatePassword = async function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.login = async function (user: User, password: string) {
  const isMatch = user && (await user.validatePassword(password));
  if (!isMatch) {
    throw new HttpException(
      'Username or password is incorrect',
      HttpStatus.BAD_REQUEST,
    );
  }
  user.password = undefined;
  return user;
};
