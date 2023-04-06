import { Injectable } from "@nestjs/common";
import { MysqlBaseService } from "src/common/mysql/base.service";
import { RoomEntity } from "./room.entity";
import { RoomDTO } from "./room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()

export class RoomService extends MysqlBaseService<RoomEntity,RoomDTO>{
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>
    ){
        super(roomRepository);
    }
}