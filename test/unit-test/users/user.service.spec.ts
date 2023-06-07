import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { describe } from 'node:test';
import { CreateUserDTO } from 'src/dto/UserDTO/createUser.dto';
import { UpdateUserDTO } from 'src/dto/UserDTO/updateUser.dto';
import { UserDTO } from 'src/dto/UserDTO/user.dto';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { AuthService } from '../../../src/auth/auth.service';
import { jwtConstants } from '../../../src/auth/constants';
import { UserEntity } from '../../../src/entity/user.entity';
import { UserService } from '../../../src/users/user.service';

class MockJwtService {
  signAsync(payload: any, options?: any): string {
    if (options && options.secret === jwtConstants.secret) {
      return 'testToken';
    }
    throw new Error('Invalid secret');
  }
}

describe('UserService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let userRepository: Repository<UserEntity>;
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
    userRepository = moduleRef.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  describe('create user', () => {
    it('tạo user mới ', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'admin',
        password: 'admin123',
        type: 1,
      };
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue(
          createUserDTO as DeepPartial<UserEntity> & UserEntity,
        );
      const result = await userService.createUser(createUserDTO);
      expect(saveSpy).toHaveBeenCalledWith(createUserDTO);
      expect(result).toEqual(createUserDTO);
    });
    it('báo lỗi trùng lặp dữ liệu', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'admin',
        password: 'admin',
        type: 1,
      };
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      await expect(userService.createUser(createUserDTO)).rejects.toThrowError(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        ),
      );
      expect(saveSpy).toHaveBeenCalledWith(createUserDTO);
    });
    it('trả ra với các lỗi phù hợp', async () => {
      const createUserDTO: CreateUserDTO = {
        username: 'admin',
        password: 'admin',
        type: 1,
      };
      const resolveErrorMock = jest.fn().mockImplementation((error) => {
        if (error.message === 'Unknown error') {
          throw new Error('Internal server error');
        } else {
          throw new Error('Unexpected error');
        }
      });
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(resolveErrorMock);

      await expect(userService.createUser(createUserDTO)).rejects.toThrowError(
        'Internal server error',
      );
      expect(saveSpy).toHaveBeenCalledWith(createUserDTO);
      resolveErrorMock.mockRestore();
    });
  });

  describe('findOneByID', () => {
    it('findOneByID', async () => {
      const id = 1;
      const expectedUser: UserDTO = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 1,
        deleted_at: null,
        authen_token: '',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(expectedUser as UserEntity);
      const result = await userService.findOneByID(id);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(expectedUser);
    });
  });
  describe('findOneByToken', () => {
    it('findOneByToken', async () => {
      const authen_token = 'tokentnek';
      const expectedUser: UserDTO = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 1,
        deleted_at: null,
        authen_token: 'tokentnek',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(expectedUser as UserEntity);
      const result = await userService.findOneByToken(authen_token);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { authen_token } });
      expect(result).toEqual(expectedUser);
    });
  });
  describe('findOneByUsername', () => {
    it('findOneByUsername', async () => {
      const username = 'admin';
      const expectedUser: UserDTO = {
        id: 1,
        username: 'admin',
        password:
          '$2b$10$J7hYNTD6rMwlwQKlNlMs.O7dtEw5aawCqf37iXDAvagtx1IlQIgZe',
        type: 1,
        deleted_at: null,
        authen_token: '',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const findOneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(expectedUser as UserEntity);
      const result = await userService.findOneByUsername(username);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { username } });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('update', () => {
    it('cập nhật user thành công', async () => {
      const id = 1;
      const updateUserDTO: UpdateUserDTO = {
        username: 'admin',
        password: 'admin123',
      };
      const updateSpy = jest
        .spyOn(userRepository, 'update')
        .mockResolvedValue({ affected: 1 } as UpdateResult);
      const result = await userService.updateUser(id, updateUserDTO);
      expect(updateSpy).toHaveBeenCalledWith(id, updateUserDTO);
      expect(result).toEqual(updateUserDTO);
    });
  });

  describe('delete', async () => {
    it('xóa user thành công', async () => {
      const id = 1;
      const deleteSpy = jest
        .spyOn(userRepository, 'softDelete')
        .mockResolvedValue(undefined);
      const result = await userService.deleteUser(id);
      expect(deleteSpy).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
