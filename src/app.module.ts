import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(
      {
        ignoreEnvFile: true,
        isGlobal: true
      }
    ),
    PrismaModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }
