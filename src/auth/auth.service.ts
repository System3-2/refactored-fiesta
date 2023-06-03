import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid'

type User = {
  name: string;
  email: string
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService) { }

  async signup(signupDto: SignupDto) {
    const hash = await argon.hash(signupDto.password)
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupDto.email,
          name: signupDto.name,
          hash: hash,
        },
        select: {
          email: true,
          name: true,
          id: true
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

    if (!user) throw new NotFoundException("User does not exists")

    const pwMatches = argon.verify(user.hash, loginDto.password)

    if (!pwMatches) throw new ForbiddenException("Bad credentials")

    // return 'Login success'
    const { email, name } = user

    return this.signToken(user.id, { name, email }, 'Login successful')
  }

  async signToken(userId: number, data: User, message: string): Promise<{ access_token: string, data: User, message: string }> {

    const payload = {
      sub: userId,
      data
    }
    const token = await this.jwt.signAsync(payload)

    return {
      access_token: token,
      data,
      message
    }
  }

  async upload(dataBuffer: Buffer, filename: string) {
    const s3 = new S3()
    // const uploadResult = await s3.upload({
    //   Bucket: this.config.get('AWS_BUCKET_NAME'),
    //   Body: dataBuffer,
    //   Key: `${uuid()} - ${filename}`
    // })

    const uploadResult = await s3.upload({
      Bucket: this.config.get('AWS_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${uuid()}-${filename}`,
    }).promise();

    console.log(uploadResult)
    return uploadResult

  }
}
