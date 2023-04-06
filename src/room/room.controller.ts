import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { RoomService } from "./room.service";
import { promises } from 'dns';
import { RoomDTO } from './room.dto';
import { RoomEntity } from './room.entity';

@Controller('room')

export class RoomController{
    constructor(private readonly roomService: RoomService){}
    
@Post('create')
createRoom(@Body() room: RoomEntity): Promise<RoomDTO>{
    return this.roomService.save(room)
}
@Put(':id')
updateRoom(@Param('id') id: number, @Body() room: RoomDTO): Promise<RoomDTO>{
    return this.roomService.update(id,room)
}
@Get(':id')
getRoom(@Param('id') id: number):Promise<RoomDTO>{
    return this.roomService.get(id);
}
@Delete(':id')
deleteRoom(@Param('id') id: number):Promise<void>{
    return this.roomService.remove(id);
}
}