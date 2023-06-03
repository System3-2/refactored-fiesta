import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EventListener } from './EventListener.service';
import * as dotenv from 'dotenv'
dotenv.config()

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, EventListener],
  controllers: [AuthController]
})
export class AuthModule { }
