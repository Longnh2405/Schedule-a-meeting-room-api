import {
    Body,
    Controller,
    Delete,
    Get,
    Next,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomDTO } from '../dto/room.dto';
import { RoomEntity } from '../entity/room.entity';
import { UserService } from 'src/user/user.service';

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
    ) { }
    @Post(':user_id/createRoom')
    async createRoom(
        @Param('user_id') user_id: number,
        @Body() room: RoomEntity,
    ): Promise<RoomDTO> {
        const checkrole = await this.userService.checkRole(user_id);
        console.log(checkrole);
        if(checkrole === 1){
            return this.roomService.save(room);
        } else{
            console.log("Không có quyền thêm!");
        }

    }

    @Put(':user_id/update/:id')
    async updateRoom(
        @Param('user_id') user_id: number,
        @Param('id') id: number,
        @Body() room: RoomEntity,
    ): Promise<RoomDTO> {
        const checkrole = await this.userService.checkRole(user_id);
        console.log(checkrole);
        if(checkrole === 1){
            return this.roomService.update(id,room);
        } else{
            console.log("Không có quyền sửa!");
        }
    }

    @Delete(':user_id/delete/:id')
    async deleteRoom(
        @Param('user_id') user_id: number,
        @Param('id') id: number,
    ): Promise<void> {
        const checkrole = await this.userService.checkRole(user_id);
        console.log(checkrole);
        if(checkrole === 1){
            return this.roomService.remove(id);
        } else{
            console.log("Không có quyền xoá!");
        }
    }
    @Get(':id/exist')
    async existRoom(@Param('id') id: number):Promise<number>{
        return  this.roomService.existRoom(id)
    }

    @Get(':user_id/getRooms')
    async getRoom(
        @Param('user_id') user_id: number,
        // @Param('id') id: number,
    ): Promise<RoomDTO[]> {
        const checkrole = await this.userService.checkRole(user_id);
        if(checkrole === 1 || checkrole ===2){
            return this.roomService.allRoom(user_id);
        } else if(checkrole ===3){
            return this.roomService.availableRoom(user_id)
        }
    }

    // @Post(':user_id/create')
    // createRoom(
    //     @Param('user_id') user_id: number,
    //     @Body() room: RoomEntity,
    // ): Promise<RoomDTO> {
    //     return this.roomService.save(room);
    // }
    // @Put(':id')
    // updateRoom(@Param('id') id: number, @Body() room: RoomDTO): Promise<RoomDTO> {
    //     return this.roomService.update(id, room);
    // }
    // @Get(':id')
    // getRoom(@Param('id') id: number): Promise<RoomDTO> {
    //     return this.roomService.get(id);
    // }
    // @Delete(':id')
    // deleteRoom(@Param('id') id: number): Promise<void> {
    //     return this.roomService.remove(id);
    // }
    
}
