import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginLogoutDTO } from 'src/dto/login.logout.dto';
import { UserDTO } from 'src/dto/user.dto';

import { UserEntity } from 'src/entity/user.entity';
import { resolveError } from 'src/error/error';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}
  @Post()
  async createUser(@Body() user: UserDTO, @Res() res: Response): Promise<void> {
    await this.userService.createUser(user);
    res.status(HttpStatus.OK).send(`
    {
        "code": ${HttpStatus.OK},
        "success": true,
        "message": "Thêm người dùng thành công"
    }`);
  }

  @Post('login')
  async UserLogin(
    @Body() user: LoginLogoutDTO,
    @Res() res: Response,
  ): Promise<void> {
    const auth_token = await this.authService.login(
      user.username,
      user.password,
    );
    res.status(HttpStatus.OK).send(auth_token);
  }

  @Post('logout')
  async UserLogout(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
  ) {
    try {
      authorization = await this.authService.getToken();
      const user = await this.userService.findOneByToken(authorization);
      if (user && authorization !== null) {
        user.authen_token = null;
        await this.userService.updateUser(user.id, user);
        await this.authService.removeToken();
        res.status(HttpStatus.OK).send('Đăng xuất thành công!');
      } else {
        throw new HttpException(
          {
            code: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'BAD REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      resolveError(error);
    }
  }

  @Get('/:id')
  async getUser(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      authorization = await this.authService.getToken();
      const userFindByToken = await this.userService.findOneByToken(
        authorization,
      );
      const userFindByID = await this.userService.findOneByID(id);
      if (userFindByToken.id === userFindByID.id) {
        res.status(HttpStatus.OK).send({
          id: userFindByID.id,
          username: userFindByID.username,
          password: userFindByID.password,
          type: userFindByID.type,
        });
      } else {
        throw new HttpException(
          {
            code: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'BAD REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      resolveError(error);
    }
  }

  @Put('/:id')
  async updateUser(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() userUpdate: UserEntity,
  ) {
    try {
      authorization = await this.authService.getToken();
      const userFindByToken = await this.userService.findOneByToken(
        authorization,
      );
      const userFindByID = await this.userService.findOneByID(id);
      if (userFindByToken.id === userFindByID.id) {
        userFindByID.username = userUpdate.username;
        userFindByID.password = userUpdate.password;
        await this.userService.updateUser(id, userFindByID);
        res.status(HttpStatus.OK).send({
          username: userFindByID.username,
          password: userFindByID.password,
        });
      } else {
        throw new HttpException(
          {
            code: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'BAD REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      resolveError(error);
    }
  }

  @Delete('/:id')
  async deleteUser(
    @Headers('authorization') authorization: string,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      authorization = await this.authService.getToken();
      const userFindByToken = await this.userService.findOneByToken(
        authorization,
      );
      const userFindByID = await this.userService.findOneByID(id);
      if (userFindByToken.id === userFindByID.id) {
        userFindByID.authen_token = null;
        await this.userService.updateUser(id, userFindByID);
        await this.userService.deleteUser(id);
        res.status(HttpStatus.OK).send(`
    {
        "code": ${HttpStatus.OK},
        "success": true,
        "message": "Xoá thành công"
    }`);
      } else {
        throw new HttpException(
          {
            code: HttpStatus.BAD_REQUEST,
            success: false,
            message: 'BAD REQUEST',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      resolveError(error);
    }
  }
}
