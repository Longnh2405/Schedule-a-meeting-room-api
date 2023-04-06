import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() user: UserDTO): Promise<UserDTO> {
    return this.userService.save(user);
  }

  @Put(':id')
  updateUser(@Param('id') id: number, @Body() user: UserDTO): Promise<UserDTO> {
    return this.userService.update(id, user);
  }

  @Get(':id')
  getUser(@Param('id') id: number): Promise<UserDTO> {
    return this.userService.get(id);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: number): Promise<void>{
    return this.userService.remove(id);
  }
}
