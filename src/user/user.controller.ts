import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  createUser(@Body() user: UserDTO): Promise<UserDTO> {
    return this.userService.save(user);
  }

  @Put('update/:id')
  updateUser(@Param('id') id: number, @Body() user: UserDTO): Promise<UserDTO> {
    return this.userService.update(id, user);
  }

  @Get('get/:id')
  getUser(@Param('id') id: number): Promise<UserDTO> {
    return this.userService.get(id);
  }

  @Delete('delete/:id')
  deleteUser(@Param('id') id: number): Promise<void>{
    return this.userService.remove(id);
  }
  // @Get('checkRole/:id')
  // checkRole(@Param('id') id: number): Promise<number>{
  //   return this.userService.checkRole(id);
  // }
}
