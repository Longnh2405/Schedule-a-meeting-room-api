import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { MeetingRoomController } from './meeting_room.controller';
import { MeetingRoomService } from './meeting_room.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingRoomEntity])],
  providers: [MeetingRoomService],
  controllers: [MeetingRoomController],
})
export class MeetingRoomModule {}
