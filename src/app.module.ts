import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthService } from './auth/auth.service';
import { MeetingEntity } from './entity/meeting.entity';
import { MeetingRoomEntity } from './entity/meeting_room.entity';
import { RoomEntity } from './entity/room.entity';
import { TeamEntity } from './entity/team.entity';
import { UserEntity } from './entity/user.entity';
import { UserController } from './users/user.controller';
import { UserService } from './users/user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoomController } from './rooms/room.controller';
import { RoomService } from './rooms/room.service';
import { TeamController } from './teams/team.controller';
import { TeamService } from './teams/team.service';

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
    JwtModule.register({
      secret: 'Booking-Room',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [UserController, TeamController, RoomController],
  providers: [UserService, AuthService, AuthGuard, TeamService, RoomService],
})
export class AppModule {}
