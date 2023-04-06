import { Module } from "@nestjs/common";
import { MeetingService } from "./meeting.service";
import {  MeetingController } from "./meeting.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MeetingEntity } from "./meeting.entity";

@Module({
    imports: [TypeOrmModule.forFeature([MeetingEntity])],
    providers: [MeetingService],
    controllers: [MeetingController]
})
export class MeetingModule{

}