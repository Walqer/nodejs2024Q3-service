import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Res() res: Response) {
    try {
      return res.status(HttpStatus.OK).send(this.userService.findAll());
    } catch (error) {
      console.log(error);
      return res.status(error.status).send(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Response | HttpException {
    try {
      this.userService.remove(id);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        return res.status(error.getStatus()).send(error.message);
      } else {
        console.error('Unexpected error:', error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send('Internal Server Error');
      }
    }
  }
}
