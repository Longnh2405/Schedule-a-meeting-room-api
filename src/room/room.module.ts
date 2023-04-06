import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "./room.entity";
import { RoomService } from "./room.service";
import { MysqlBaseService } from "src/common/mysql/base.service";
import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity])],
    providers: [RoomService,MysqlBaseService],
    controllers: [RoomController],
})
export class RoomModule{

}