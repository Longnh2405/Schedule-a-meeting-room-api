import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { TeamEntity } from './entity/team.entity';
import { RoomEntity } from './entity/room.entity';
import { MeetingRoomEntity } from './entity/meeting_room.entity';
import { MeetingEntity } from './entity/meeting.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'long123',
      database: 'meeting-room2',
      entities: [
        UserEntity,
        TeamEntity,
        RoomEntity,
        MeetingRoomEntity,
        MeetingEntity,
      ],
      // logging: 'all',
      synchronize: true,
      // synchronize: false,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      TeamEntity,
      RoomEntity,
      MeetingRoomEntity,
      MeetingEntity,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
