import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { Repository } from 'typeorm';
import { RoomDTO } from '../dto/room.dto';
import { RoomEntity } from '../entity/room.entity';

@Injectable()
export class RoomService extends MysqlBaseService<RoomEntity, RoomDTO> {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {
    super(roomRepository);
  }
}
