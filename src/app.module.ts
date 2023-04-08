import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { UserEntity } from './entity/user.entity';
import { RoomEntity } from './entity/room.entity';
import { TeamEntity } from './entity/team.entity';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { MeetingEntity } from './entity/meeting.entity';
import { MeetingController } from './metting/meeting.controller';
import { MeetingService } from './metting/meeting.service';
import { MeetingRoomEntity } from './entity/meeting_room.entity';
import { MeetingRoomService } from './meeting_room/meeting_rom.service';
import { MeetingRoomController } from './meeting_room/meeting_room.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'long123',
      database: 'meeting-room2',
      entities: [UserEntity,RoomEntity,TeamEntity,MeetingEntity, MeetingRoomEntity],
      // logging: 'all',
      // synchronize: true,
      // synchronize: false,
    }),
    TypeOrmModule.forFeature([UserEntity, RoomEntity, TeamEntity,MeetingEntity,MeetingRoomEntity]),
  ],
  controllers: [UserController, RoomController, TeamController,MeetingController,MeetingRoomController],
  providers: [UserService, RoomService, TeamService, MeetingService,MeetingRoomService],
})
export class AppModule {}
