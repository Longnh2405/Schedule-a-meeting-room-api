import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RoomController } from './room/room.controller';
import { RoomService } from './room/room.service';
import { UserEntity } from './user/user.entity';
import { RoomEntity } from './room/room.entity';
import { TeamEntity } from './team/team.entity';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'long123',
      database: 'meeting-room2',
      entities: [UserEntity,RoomEntity,TeamEntity],
      // logging: 'all',
      synchronize: true,
    }),TypeOrmModule.forFeature([UserEntity,RoomEntity,TeamEntity])
  ],
  controllers: [UserController,RoomController,TeamController],
  providers: [UserService,RoomService, TeamService],
})
export class AppModule {}
