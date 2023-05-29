import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  signup() {
    return 'User signup from providers'
  }

  login() {
    return 'User logged from providers'
  }
}
