import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MeetingRoomService } from './meeting-room.service';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/admin.guard';
import { RoomService } from 'src/rooms/room.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMeetingRoomDTO } from 'src/dto/MeetingRoomDTO/create-meeting_room.dto';
import { UpdateMeetingRoomDTO } from 'src/dto/MeetingRoomDTO/update-meeting_room.dto';

@Controller('meeting-rooms')
export class MeetingRoomController {
  constructor(
    private meetingRoomService: MeetingRoomService,
    private roomService: RoomService,
  ) {}

  @UseGuards(AdminGuard)
  @Post()
  async createMeetingRoom(
    @Res() res: Response,
    @Req() req: Request,
    @Body() meetingRoom: CreateMeetingRoomDTO,
  ): Promise<void> {
    await this.roomService.findOneByID(meetingRoom.room_id);
    await this.meetingRoomService.createMeetingRoom(meetingRoom);
    res.status(HttpStatus.OK).send(`
      {
          code: ${HttpStatus.OK},
          success: true,
          message: "Thêm meeting-room thành công"
      }`);
  }

  @UseGuards(AdminGuard)
  @Get('/:id')
  async getMeetingRoom(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<void> {
    const meetingRoom = await this.meetingRoomService.findOneByID(id);
    res.status(HttpStatus.OK).send(meetingRoom);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateMeetingRoom(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: number,
    @Body() meetingRoom: UpdateMeetingRoomDTO,
  ): Promise<void> {
    await this.roomService.findOneByID(meetingRoom.room_id);
    const newMeetingRoom = await this.meetingRoomService.updateMeetingRoom(
      id,
      meetingRoom,
    );
    res.status(HttpStatus.OK).send(`
    {
        code: ${HttpStatus.OK},
        success: true,
        message: "Cập nhật meeting-room thành công"
    }`);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteMeetingRoom(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<void> {
    await this.meetingRoomService.deleteMeetingRoom(id);
    res.status(HttpStatus.OK).send(`
    {
        code: ${HttpStatus.OK},
        success: true,
        message: "Xoá meeting-room thành công"
    }`);
  }

  @UseGuards(AuthGuard)
  @Get('rooms/:room_id')
  async getMeetingRoomAvailable(
    @Res() res: Response,
    @Req() req: Request,
    @Param('room_id') room_id: number,
  ): Promise<void> {
    const userInfo = req['user'];
    console.log(userInfo.type);
    const meetingRoom = await this.meetingRoomService.getMeetingRoomForUser(
      room_id,
    );
    res.status(HttpStatus.OK).send(meetingRoom);
  }
}
