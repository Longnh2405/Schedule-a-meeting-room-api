import { Injectable } from '@nestjs/common';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { UserEntity } from '../entity/user.entity';
import { UserDTO } from '../dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService extends MysqlBaseService<UserEntity, UserDTO> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
  async checkRole(id: number): Promise<number> {
    const options: FindOneOptions = {
      where: { id },
    };
    const check = await this.userRepository.findOne(options);
    return check.type;
  }
  async ExistUser(id: number): Promise<UserDTO> {
    const options: FindOneOptions = {
      where: {
        id: id,
      },
    };
    return this.userRepository.findOne(options);
  }
}
