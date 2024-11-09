import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  HttpException,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private handleError(error: unknown, res: Response) {
    if (error instanceof HttpException) {
      return res.status(error.getStatus()).send(error.message);
    } else {
      console.error('Unexpected error:', error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Res() res: Response) {
    try {
      return this.userService.findAll();
    } catch (error) {
      this.handleError(error, res);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    try {
      return this.userService.update(id, updateUserDto);
    } catch (error: unknown) {
      this.handleError(error, res);
    }
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
      this.handleError(error, res);
    }
  }
}
