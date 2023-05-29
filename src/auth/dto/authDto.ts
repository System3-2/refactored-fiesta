import { IsEmail, IsString, isStrongPassword, MaxLength, MinLength, Matches } from "class-validator";

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3, {
    message: 'Name too short'
  })
  @MaxLength(50, {
    message: 'Name too long'
  })
  name: string;


  @MinLength(8, {
    message: 'Password too weak'
  })

  @MaxLength(50, {
    message: 'Password too long'
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password: string;
}


export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(8, {
    message: 'Password too weak'
  })

  @MinLength(50, {
    message: 'Password too long'
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
  password: string;
}
