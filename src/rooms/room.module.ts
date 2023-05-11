import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from 'src/entity/team.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  providers: [RoomService],
  controllers: [RoomController],
})
export class TeamModule {}
