import { Module } from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import {  MeetingController } from "./meeting.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeetingEntity } from "../entity/meeting.entity";
import { UserEntity } from "src/entity/user.entity";
import { RoomEntity } from "src/entity/room.entity";
import { TeamEntity } from "src/entity/team.entity";
import { TeamService } from "src/team/team.service";
import { RoomService } from "src/room/room.service";
import { UserService } from "src/user/user.service";

@Module({
    imports: [TypeOrmModule.forFeature([MeetingEntity,UserEntity,RoomEntity,TeamEntity])],
    providers: [MeetingService,TeamService,RoomService, UserService],
    controllers: [MeetingController]
})
export class MeetingModule{

}