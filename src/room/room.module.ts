import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "../entity/room.entity";
import { RoomService } from "./room.service";
import { MysqlBaseService } from "src/common/mysql/base.service";
import { Module } from "@nestjs/common";
import { RoomController } from "./room.controller";
import { UserEntity } from "src/entity/user.entity";
import { UserService } from "src/user/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity,UserEntity])],
    providers: [RoomService,MysqlBaseService,UserService],
    controllers: [RoomController],
})
export class RoomModule{

}