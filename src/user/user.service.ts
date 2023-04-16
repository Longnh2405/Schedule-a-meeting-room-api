import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService extends MysqlBaseService<UserEntity, UserDTO> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
