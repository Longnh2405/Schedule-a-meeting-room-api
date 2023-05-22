import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from 'src/entity/team.entity';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
