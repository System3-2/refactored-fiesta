import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(
      {
        ignoreEnvFile: true,
        isGlobal: true
      }
    ),
    EventEmitterModule.forRoot(),
    PrismaModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
