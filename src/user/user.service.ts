import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { v4 as uuidv4, validate } from 'uuid';
@Injectable()
export class UserService {
  private users: User[] = [];
  private validateId(id: string) {
    if (!validate(id)) {
      throw new HttpException('Неверный формат ID', HttpStatus.BAD_REQUEST);
    }
  }
  create(createUserDto: CreateUserDto): Omit<User, 'password'> {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Login and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser: User = {
      ...createUserDto,
      id: uuidv4(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    const { password, ...newUserResponse } = newUser;
    return newUserResponse;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User | undefined {
    this.validateId(id);
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { oldPassword, newPassword } = updateUserDto;
    if (!oldPassword || !newPassword) {
      throw new HttpException(
        'Old password and new password are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.validateId(id);

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== user.password) {
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);
    }
    const updatedUser: User = {
      ...user,
      password: newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    };
    const userIndex = this.users.findIndex((user) => user.id === id);
    this.users[userIndex] = updatedUser;
    const { password, ...updatedUserResponse } = updatedUser;

    return updatedUserResponse;
  }

  remove(id: string) {
    this.validateId(id);
    this.findOne(id);
    return (this.users = this.users.filter((user) => user.id !== id));
  }
}
