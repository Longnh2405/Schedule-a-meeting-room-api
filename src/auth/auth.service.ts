import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  private readonly tokenKey = 'authen_token';
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if ((!user || user.password !== password) && user.deleted_at == null) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, id: user.id, type: user.type };
    const authen_token = await this.jwtService.signAsync(payload);
    let localStorage = require('local-storage');
    user.authen_token = authen_token;
    await this.usersService.updateUser(user.id, user);
    await localStorage.set(this.tokenKey, authen_token);
    return {
      username: user.username,
      password: user.password,
      authen_token,
    };
  }

  getToken(): Promise<string> {
    let localStorage = require('local-storage');
    return localStorage.get(this.tokenKey);
  }

  removeToken(): Promise<void> {
    let localStorage = require('local-storage');
    return localStorage.remove(this.tokenKey);
  }
}
