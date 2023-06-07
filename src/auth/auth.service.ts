import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    const checkPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!user || !checkPassword || user.deleted_at !== null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, id: user.id, type: user.type };
    const authen_token = await this.jwtService.signAsync(payload);
    try {
      user.authen_token = authen_token;
      await this.userService.updateUser(user.id, user);
    } catch {
      throw new BadRequestException(
        'Cập nhật token vào user không thành công!',
      );
    }

    return {
      username: user.username,
      authen_token,
    };
  }
}
