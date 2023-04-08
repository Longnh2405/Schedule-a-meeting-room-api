import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '../entity/user.entity';
import { MysqlBaseService } from 'src/common/mysql/base.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserService, MysqlBaseService],
    controllers: [UserController]
})
export class UserModule {
}
