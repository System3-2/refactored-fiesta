import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2'
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto';
import { NotFoundError } from 'rxjs';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async signup(signupDto: SignupDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          hash: signupDto.password
        }
      })

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") throw new BadRequestException("Email already exists")
      }
      else {
        throw new BadRequestException("Something went wrong")
      }
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email
      }
    })

    if (!user) throw new NotFoundError("User does not exists")

    if (loginDto.password !== user.hash) throw new ForbiddenException("bad credentials")
  }
}
