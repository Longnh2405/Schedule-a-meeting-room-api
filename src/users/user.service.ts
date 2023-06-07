import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateUserDTO } from '../dto/UserDTO/createUser.dto';
import { UpdateUserDTO } from '../dto/UserDTO/updateUser.dto';
import { UserDTO } from 'src/dto/UserDTO/user.dto';

import { UserEntity } from '../entity/user.entity';
import { resolveError } from '../error/error';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUser: CreateUserDTO): Promise<CreateUserDTO> {
    try {
      await this.userRepository.save(createUser);
      return plainToInstance(CreateUserDTO, createUser, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        resolveError(error);
      }
    }
  }

  async findOneByUsername(username: string): Promise<UserDTO> {
    const options: FindOneOptions = {
      where: {
        username,
      },
    };
    return await this.userRepository.findOne(options);
  }

  async findOneByToken(authen_token: string): Promise<UserDTO> {
    const options: FindOneOptions = {
      where: {
        authen_token,
      },
    };
    return await this.userRepository.findOne(options);
  }

  async findOneByID(id: number): Promise<UserDTO> {
    const options: FindOneOptions = {
      where: {
        id,
      },
    };
    return await this.userRepository.findOne(options);
  }

  async updateUser(
    id: number,
    updateUserDTO: UpdateUserDTO,
  ): Promise<UpdateUserDTO> {
    await this.userRepository.update(id, updateUserDTO);
    return plainToInstance(UpdateUserDTO, updateUserDTO, {
      exposeDefaultValues: true,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
