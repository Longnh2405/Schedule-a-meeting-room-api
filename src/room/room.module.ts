import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { RoomEntity } from '../entity/room.entity';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [RoomService, MysqlBaseService],
  controllers: [RoomController],
})
export class RoomModule {}
