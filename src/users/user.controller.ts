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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { LoginLogoutDTO } from 'src/dto/login.logout.dto';
import { UserDTO } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/entity/user.entity';
import { resolveError } from 'src/error/error';
import { UserService } from './user.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  async createUser(
    @Body() user: UserDTO,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    user.password = await bcrypt.hash(user.password, 10);
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

  @UseGuards(AuthGuard)
  @Post('logout')
  async UserLogout(
    @Headers('authorization') authorization: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    try {
      const userinfo = request['user'];
      const user = await this.userService.findOneByID(userinfo.id);
      if (user) {
        user.authen_token = null;
        await this.userService.updateUser(user.id, user);
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

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUser(
    @Headers('authorization') authorization: string,
    @Req() request: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const userinfo = request['user'];
      const userFindByToken = await this.userService.findOneByID(userinfo.id);
      const user = await this.userService.findOneByID(id);
      if (userFindByToken.id === Number(id) || userFindByToken.type === 1) {
        res.status(HttpStatus.OK).send({
          id: user.id,
          username: user.username,
          password: user.password,
          type: user.type,
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

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateUser(
    @Headers('authorization') authorization: string,
    @Req() request: Request,
    @Res() res: Response,
    @Param('id') id: number,
    @Body() userUpdate: UserEntity,
  ) {
    try {
      const userinfo = request['user'];
      const userFindByToken = await this.userService.findOneByID(userinfo.id);
      const user = await this.userService.findOneByID(id);
      if (userFindByToken.id === Number(id) || userFindByToken.type === 1) {
        user.username = userUpdate.username;
        user.password = await bcrypt.hash(user.password, 10);
        await this.userService.updateUser(id, user);
        res.status(HttpStatus.OK).send({
          username: user.username,
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

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteUser(
    @Headers('authorization') authorization: string,
    @Req() request: Request,
    @Res() res: Response,
    @Param('id') id: number,
  ) {
    try {
      const userinfo = request['user'];
      const userFindByToken = await this.userService.findOneByID(userinfo.id);
      const user = await this.userService.findOneByID(id);
      if (userFindByToken.id === Number(id) || userFindByToken.type === 1) {
        user.authen_token = null;
        await this.userService.updateUser(id, user);
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
