import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { UserDTO } from 'src/dto/user.dto';
import { UserEntity } from 'src/entity/user.entity';
import { resolveError } from 'src/error/error';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // private authService: AuthService,
  ) {}

  async createUser(userDTO: UserDTO): Promise<UserDTO> {
    try {
      await this.userRepository.save(userDTO);
      return plainToInstance(UserDTO, userDTO, {
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

  async updateUser(id: number, userDTO: UserDTO): Promise<UserDTO> {
    await this.userRepository.update(id, userDTO);
    return plainToInstance(UserDTO, userDTO, {
      exposeDefaultValues: true,
    });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
