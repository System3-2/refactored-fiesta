import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core';
import { ThrottleModule } from './throttle/throttle.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(
      {
        ignoreEnvFile: true,
        isGlobal: true
      }
    ),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 2,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    ThrottleModule
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
