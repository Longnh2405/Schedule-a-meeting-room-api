import { Injectable } from '@nestjs/common';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { UserEntity } from './user.entity';
import { UserDTO } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class UserService extends MysqlBaseService<UserEntity,UserDTO> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
