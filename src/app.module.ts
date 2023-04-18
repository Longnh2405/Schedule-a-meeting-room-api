import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './entity/meeting.entity';
import { MeetingRoomEntity } from './entity/meeting_room.entity';
import { RoomEntity } from './entity/room.entity';
import { TeamEntity } from './entity/team.entity';
import { UserEntity } from './entity/user.entity';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        UserEntity,
        RoomEntity,
        TeamEntity,
        MeetingEntity,
        MeetingRoomEntity,
      ],
      // logging: 'all',
      // synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      RoomEntity,
      TeamEntity,
      MeetingEntity,
      MeetingRoomEntity,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
