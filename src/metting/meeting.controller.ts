import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Repository } from 'typeorm';
import { MeetingEntity } from 'src/entity/meeting.entity';
import { MeetingDTO } from 'src/dto/meeting.dto';
import { UserService } from 'src/user/user.service';
import { RoomService } from 'src/room/room.service';
import { TeamService } from 'src/team/team.service';
import { MeetingRoomService } from 'src/meeting_room/meeting_rom.service';

@Controller('meeting')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
    private readonly teamService: TeamService,
    private readonly meetingRoomService: MeetingRoomService,
  ) { }

  @Post(':user_id/createMeeting')
  async createMeeting(
    @Param('user_id') user_id: number,
    @Body() meeting: MeetingEntity,
  ) {
    const checkExistUser = await this.userService.ExistUser(user_id);
    const checkExistTeam = await this.teamService.existTeam(meeting.team_id);
    const checkStatusMeetingRoom =
      await this.meetingRoomService.checkExistMeetingRoomID(
        meeting.meeting_room_id,
      );
    if (checkExistTeam && checkExistUser && checkStatusMeetingRoom) {
      await this.meetingRoomService.updateStatusMeetingRoom(
        meeting.meeting_room_id,
      );
      meeting.user_id = user_id;
      return await this.meetingService.save(meeting);
    } else {
      console.log('Thêm cuộc họp thất bại!');
    }
  }

  @Put(':user_id/updateMeeting/:id')
  async updateMeeting(
    @Param('user_id') user_id: number,
    @Param('id') id: number,
    @Body() meeting: MeetingEntity,
  ) {
    const checkExistUser = await this.userService.ExistUser(user_id);
    const checkExistMeeting = await this.meetingService.FindMeeting(id);
    const checkExistTeam = await this.teamService.existTeam(meeting.team_id);
    const checkStatusMeetingRoom =
      await this.meetingRoomService.checkExistMeetingRoomID(
        meeting.meeting_room_id,
      );
    if (
      checkExistTeam &&
      checkExistUser &&
      checkStatusMeetingRoom &&
      checkExistMeeting
    ) {
      await this.meetingRoomService.updateStatusMeetingRoom(
        meeting.meeting_room_id,
      );
      meeting.user_id = user_id;
      return await this.meetingService.save(meeting);
    } else {
      console.log('Thêm cuộc họp thất bại!');
    }
  }
}

// {
//     "start_time":"2022-04-04T08:30:00Z",
//     "end_time": "2023-05-04T08:30:00Z",
//     "content": "contentne",
//     "room_id": 4,
//     "team_id":2
// }

// {
//   "meeting_room_id": 5,
//   "content": "contentne",
//   "team_id": 1
//   }
