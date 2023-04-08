import { Injectable } from "@nestjs/common";
import { MysqlBaseService } from "src/common/mysql/base.service";
import { RoomEntity } from "../entity/room.entity";
import { RoomDTO } from "../dto/room.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { UserEntity } from "src/entity/user.entity";

@Injectable()

export class RoomService extends MysqlBaseService<RoomEntity,RoomDTO>{
    constructor(
        @InjectRepository(RoomEntity)
        private readonly roomRepository: Repository<RoomEntity>,
        // @InjectRepository(UserEntity)
        // private readonly userRepository: Repository<UserEntity>
    ){
        super(roomRepository);
    }

    async checkStatus(id: number):Promise<number>{
        const options: FindOneOptions ={
            where: {id}
        }
        const checkStatus =  await this.roomRepository.findOne(options)
        return checkStatus.status
    }
    async existRoom(id: number): Promise<number>{
        const options: FindOneOptions ={
            where: {id}
        }
        const check =  await this.roomRepository.findOne(options)
        if(check){
            return 1;
        } else{
            return 0;
        }
    }
    async allRoom(user_id: number): Promise<RoomDTO[]>{
        const check =  await this.roomRepository.find()
        return check
    }
    async availableRoom(user_id: number): Promise<RoomDTO[]>{
        const options = {
            where: {status : 1}
        }
        const check =  await this.roomRepository.find(options)
        return check
    }
}