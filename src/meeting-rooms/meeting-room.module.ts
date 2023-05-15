import { Module } from '@nestjs/common';
import { MeetingRoomController } from './meeting-room.controller';
import { MeetingRoomService } from './meeting-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { RoomService } from 'src/rooms/room.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoomEntity])],
  providers: [MeetingRoomService, RoomService],
  controllers: [MeetingRoomController],
})
export class MeetingRoomModule {}
