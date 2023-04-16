import { Controller } from '@nestjs/common';
import { MeetingRoomService } from './meeting_room.service';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(private readonly meetingRoomService: MeetingRoomService) {}
}
