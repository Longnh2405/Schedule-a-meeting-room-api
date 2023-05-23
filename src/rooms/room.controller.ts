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
import { Response } from 'express';

import { AdminGuard } from 'src/auth/admin.guard';

import { ApiTags } from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import { RoomService } from './room.service';
import { CreateRoomDTO } from 'src/dto/RoomDTO/create-room.dto';
import { UpdateRoomDTO } from 'src/dto/RoomDTO/update-room.dto';

@ApiTags('Rooms')
@Controller('Rooms')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createRoom(
    @Body() room: CreateRoomDTO,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.roomService.createRoom(room);
    res.status(HttpStatus.OK).send(`
      {
          code: ${HttpStatus.OK},
          success: true,
          message: "Thêm room thành công"
      }`);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateRoom(
    @Param('id') id: number,
    @Body() room: UpdateRoomDTO,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.roomService.updateRoom(id, room);
    const newRoom = await this.roomService.findOneByID(id);
    res.status(HttpStatus.OK).send({
      name: newRoom.name,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getRoom(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    const room = await this.roomService.findOneByID(id);
    res.status(HttpStatus.OK).send(room);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteRoom(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.roomService.deleteRoom(id);
    res.status(HttpStatus.OK).send(`
      {
          "code": ${HttpStatus.OK},
          "success": true,
          "message": "Xoá thành công"
      }`);
  }
}
