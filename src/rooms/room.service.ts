import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateRoomDTO } from 'src/dto/RoomDTO/create-room.dto';
import { RoomDTO } from 'src/dto/RoomDTO/room.dto';
import { UpdateRoomDTO } from 'src/dto/RoomDTO/update-room.dto';
import { RoomEntity } from 'src/entity/room.entity';

import { resolveError } from 'src/error/error';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(createRoom: CreateRoomDTO): Promise<CreateRoomDTO> {
    try {
      await this.roomRepository.save(createRoom);
      return plainToInstance(CreateRoomDTO, createRoom, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        resolveError(error);
      }
    }
  }

  async updateRoom(
    id: number,
    updateRoom: UpdateRoomDTO,
  ): Promise<UpdateRoomDTO> {
    try {
      await this.findOneByID(id);
      await this.roomRepository.update(id, updateRoom);
      return plainToInstance(UpdateRoomDTO, updateRoom, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        resolveError(error);
      }
    }
  }

  async findOneByID(id: number): Promise<RoomDTO> {
    try {
      const options: FindOneOptions = {
        where: {
          id,
        },
      };
      const room = await this.roomRepository.findOne(options);
      if (!room) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return room;
    } catch (error) {
      resolveError(error);
    }
  }

  async deleteRoom(id: number): Promise<void> {
    try {
      await this.findOneByID(id);
      await this.roomRepository.softDelete(id);
    } catch (error) {
      resolveError(error);
    }
  }
}
