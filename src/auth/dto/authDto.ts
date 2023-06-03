import { IsEmail, IsString, isStrongPassword, MaxLength, MinLength, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignupDto {
  @ApiProperty({
    description: 'Email address',
    default: 'richardroe@gmail.com',
  })
  @IsEmail()
  email: string;


  @ApiProperty({
    description: 'Richard Roe',
    default: 'richardroe@gmail.com',
  })
  @IsString()
  @MinLength(3, {
    message: 'Name too short'
  })
  @MaxLength(50, {
    message: 'Name too long'
  })
  name: string;


  @ApiProperty({
    description: 'Password',
    default: '**********',
  })
  @MinLength(8, {
    message: 'Password too weak'
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password: string;
}


export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    default: 'richardroe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    default: '**********',
  })
  @IsString()
  password: string;
}
