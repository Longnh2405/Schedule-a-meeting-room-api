import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { UserService } from '../../../src/users/user.service';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/dto/UserDTO/user.dto';
import { UserEntity } from '../../../src/entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { jwtConstants } from '../../../src/auth/constants';
import { UpdateUserDTO } from 'src/dto/UserDTO/updateUser.dto';
class MockJwtService {
  signAsync(payload: any, options?: any): string {
    if (options && options.secret === jwtConstants.secret) {
      return 'testToken';
    }
    throw new Error('Invalid secret');
  }
}
describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('nên trả về username và authen_token nếu đăng nhập thành công', async () => {
      const username = 'admin';
      const password = 'admin';
      const authen_token = 'testToken';
      const user = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 3,
        deleted_at: null,
      };
      const userUpdate = {
        username: username,
      };
      const findOneByUsernameSpy = jest
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValue(user as UserDTO);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(authen_token);
      const updateSpy = jest
        .spyOn(userService, 'updateUser')
        .mockResolvedValue(userUpdate as UpdateUserDTO);

      const response = await authService.login(username, password);
      expect(findOneByUsernameSpy).toHaveBeenCalledWith(username);
      expect(compareSpy).toHaveBeenCalledWith(password, user.password);
      expect(signAsyncSpy).toHaveBeenCalledWith({
        username: user.username,
        id: user.id,
        type: user.type,
      });
      expect(updateSpy).toHaveBeenCalledWith(user.id, user);
      expect(response).toEqual({
        username: username,
        authen_token,
      });
    });

    it('trả ra lỗi UnauthorizedException nếu sai thông tin đăng nhập', async () => {
      const username = 'admin';
      const password = 'admin';
      const user = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 3,
        deleted_at: null,
      };
      const findOneByUsernameSpy = jest
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValue(user as UserDTO);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      const result = authService.login(username, password);
      await expect(result).rejects.toThrow(UnauthorizedException);
    });

    it('trả ra lỗi BadRequestException nếu không update được token', async () => {
      const username = 'admin';
      const password = 'admin';
      const user: UserDTO = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 3,
        deleted_at: null,
        authen_token: '',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const authen_token = 'testToken';
      const findOneByUsernameSpy = jest
        .spyOn(userService, 'findOneByUsername')
        .mockResolvedValue(user as UserDTO);
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const signAsyncSpy = jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValue(authen_token);
      const updateSpy = jest
        .spyOn(userService, 'updateUser')
        .mockRejectedValue(new Error('Failed to update user'));
      const result = authService.login(username, password);
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
