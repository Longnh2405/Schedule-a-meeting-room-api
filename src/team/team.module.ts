import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseEntity } from 'typeorm';
import { TeamEntity } from '../entity/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, BaseEntity])],
  providers: [TeamService],
  controllers: [TeamController],
})
export class TeamModule {}
