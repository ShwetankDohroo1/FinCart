import { IsEmail, IsString } from 'class-validator';

export class SigninDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
