import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeetingRoomEntity } from "src/entity/meeting_room.entity";
import { MeetingRoomService } from "./meeting_rom.service";
import { MeetingRoomController } from "./meeting_room.controller";
import { UserService } from "src/user/user.service";
import { MysqlBaseService } from "src/common/mysql/base.service";
import { UserDTO } from "src/dto/user.dto";
import { RoomService } from "src/room/room.service";
import { RoomDTO } from "src/dto/room.dto";


@Module({
    imports: [TypeOrmModule.forFeature([MeetingRoomEntity,UserDTO,RoomDTO])],
    providers: [MeetingRoomService,UserService,MysqlBaseService,RoomService],
    controllers: [MeetingRoomController]
})
export class MeetingRoomModule{

}