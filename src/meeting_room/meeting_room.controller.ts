import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting_rom.service';
import { UserService } from 'src/user/user.service';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { MeetingRoomDTO } from 'src/dto/meeting_room.dto';
import { RoomService } from 'src/room/room.service';

@Controller('meeting-room')
export class MeetingRoomController {
  constructor(
    private readonly meetingRoomService: MeetingRoomService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}
  @Post(':user_id/create-Meeting-Room')
  async createMeetingRoom(
    @Param('user_id') user_id: number,
    @Body() meetingroom: MeetingRoomEntity,
  ): Promise<MeetingRoomDTO> {
    const rom_id = meetingroom.room_id;
    const checkrole = await this.userService.checkRole(user_id);
    const checkRoomExist = await this.roomService.existRoom(rom_id);
    if (checkrole === 1 && checkRoomExist === 1) {
      return this.meetingRoomService.save(meetingroom);
    } else {
      console.log('Không thể thêm!');
    }
  }

  @Put(':user_id/update-Meeting-Room/:id')
  async updateMeetingRoom(
    @Param('user_id') user_id: number,
    // @Param('room_id') room_id: number,
    @Param('id') id: number,
    @Body() meetingroom: MeetingRoomEntity,
  ): Promise<MeetingRoomDTO> {
    const room_id :number = meetingroom.room_id;
    // room_ID 
    const checkrole = await this.userService.checkRole(user_id);
    const checkRoomExist = await this.roomService.existRoom(room_id);

    const startTime = new Date(meetingroom.start_time);
    const endTime = new Date(meetingroom.end_time)
    const check: boolean = startTime.getTime() < endTime.getTime();

    // const checkStatusMeetingRoom = await this.meetingRoomService.checkExistMeetingRoomID(meetingroom)
    
    if (checkrole === 1 && checkRoomExist === 1 && check ) {
      return this.meetingRoomService.update(id, meetingroom);
    } else {
      console.log('Không có quyền sửa!/Không tồn tại Room/ Ngày không hợp lệ!');
    }
  }

  @Delete(':user_id/delete-Meeting-Room/:id')
  async deleteMeetingRoom(
    @Param('user_id') user_id: number,
    @Param('id') id: number,
  ): Promise<void> {
    const checkrole = await this.userService.checkRole(user_id);
    console.log(checkrole);
    if (checkrole === 1) {
      return this.meetingRoomService.remove(id);
    } else {
      console.log('Không có quyền xoá!');
    }
  }
  @Get('exist-Meeting-Room/:id')
  async existMeetingRoom(@Param('id') id: number): Promise<number> {
    return this.meetingRoomService.existMeetingRoom(id);
  }

  @Get(':user_id/get-Meeting-Room')
  async getMeetingRoom(
    @Param('user_id') user_id: number,
  ): Promise<MeetingRoomDTO[]> {
    const checkrole = await this.userService.checkRole(user_id);
    if (checkrole === 1 || checkrole === 2) {
      return this.meetingRoomService.allMeetingRoom(user_id);
    } else if (checkrole === 3) {
      return this.meetingRoomService.availableMeetingRoom(user_id);
    }
  }

  @Put('update_status_meeting_room/:id')
  async updateStatusMeetingRoom(@Param('id') id: number){
    const check =  await this.meetingRoomService.checkExistMeetingRoomID(id);
    return check
  }
}
