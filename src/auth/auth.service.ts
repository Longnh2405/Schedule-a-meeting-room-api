import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
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
    user.authen_token = authen_token;
    await this.userService.updateUser(user.id, user);
    return {
      username: user.username,
      authen_token,
    };
  }
}
