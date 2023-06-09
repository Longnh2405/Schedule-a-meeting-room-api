import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMeetingDTO } from 'src/dto/MeetingDTO/create-meeting.dto';
import { Response } from 'express';
import { UpdateMeetingDTO } from 'src/dto/MeetingDTO/update-meeting.dto';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('meetings')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createMeeting(
    @Res() res: Response,
    @Req() req: Request,
    @Body() meeting: CreateMeetingDTO,
  ): Promise<void> {
    const userInfo = req['user'];
    await this.meetingService.createMeeting(meeting, userInfo.id);
    res.status(HttpStatus.OK).send(`
    {
        code: ${HttpStatus.OK},
        success: true,
        message: "Thêm meeting thành công"
    }`);
  }

  @UseGuards(AuthGuard)
  @Put('/:id')
  async updateMeeting(
    @Res() res: Response,
    @Req() req: Request,
    @Body() newMeeting: UpdateMeetingDTO,
    @Param('id') id: number,
  ): Promise<void> {
    const meeting = await this.meetingService.FindOneByID(id);
    const userInfo = req['user'];
    if (
      meeting.user_id === userInfo.id ||
      userInfo.type === 2 ||
      userInfo.type === 1
    ) {
      await this.meetingService.updateMeeting(id, newMeeting);
      res.status(HttpStatus.OK).send(`
      {
          code: ${HttpStatus.OK},
          success: true,
          message: "Cập nhật meeting thành công"
      }`);
    } else {
      throw new HttpException(
        {
          code: HttpStatus.FORBIDDEN,
          success: false,
          message: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getMeeting(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    const userInfo = req['user'];
    const meeting = await this.meetingService.FindOneByID(id);
    if (
      meeting.user_id === userInfo.id ||
      userInfo.type === 2 ||
      userInfo.type === 1
    ) {
      res.status(HttpStatus.OK).send(meeting);
    } else {
      throw new HttpException(
        {
          code: HttpStatus.FORBIDDEN,
          success: false,
          message: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteMeeting(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: number,
  ) {
    const meeting = await this.meetingService.FindOneByID(id);
    const userInfo = req['user'];
    if (
      meeting.user_id === userInfo.id ||
      userInfo.type === 2 ||
      userInfo.type === 1
    ) {
      await this.meetingService.deleteMeeting(id);
      res.status(HttpStatus.OK).send(`
    {
        code: ${HttpStatus.OK},
        success: true,
        message: "Xoá meeting thành công"
    }`);
    } else {
      throw new HttpException(
        {
          code: HttpStatus.FORBIDDEN,
          success: false,
          message: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/rooms/:room_id')
  async getMeetingForAdmin(
    @Res() res: Response,
    @Req() req: Request,
    @Param('room_id') room_id: number,
  ) {
    const userInfo = req['user'];
    const meetings = await this.meetingService.getMeetingForAdmin(room_id);
    if (userInfo.type === 2 || userInfo.type === 1) {
      res.status(HttpStatus.OK).send(meetings);
    } else {
      throw new HttpException(
        {
          code: HttpStatus.FORBIDDEN,
          success: false,
          message: 'FORBIDDEN',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
