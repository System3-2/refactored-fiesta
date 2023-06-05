import { Body, Controller, Post, HttpCode, HttpStatus, Get, UseGuards, Request, UploadedFile, UseInterceptors, UploadedFiles, StreamableFile, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';
import { JwtGuard } from './guard';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { eventTypes } from 'src/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler'

@ApiTags('Auth controller')
@Throttle(60, 2)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private event: EventEmitter2, private prisma: PrismaService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Get('private')
  private(@Request() req) {
    return req.user
  }

  @Post()
  async getEvent(@Body() loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: loginDto.email,
      }
    })
    this.event.emit(eventTypes.name, {
      userId: 1,
      user: {
        user
      }
    })
    console.log("Emmting event")
    return "Event emitting"
  }

  @Post('upload-test')
  @UseInterceptors(FileInterceptor('file', {
    dest: './', limits: {
      fileSize: 1024 * 1024, // 1MB
      files: 5, // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        console.log('i dont know what\'s happening')
        return
      }
    }
  },
  ))
  uploadFiletest(@UploadedFile() file: Express.Multer.File) {
    console.log(file.buffer)
    return file
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.authService.upload(file.buffer, file.originalname)
  }


  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files',))
  uploadMultipleFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files[0], 'file 1')
    console.log(files[1], 'file 2')
    return 'Multiple file uploaded'
  }

  @Get('file')
  getFile(@Res({ passthrough: true }) res: Response): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package.json"',
    })
    return new StreamableFile(file);
  }
}
