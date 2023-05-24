import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from 'src/entity/meeting.entity';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity])],
  providers: [MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
