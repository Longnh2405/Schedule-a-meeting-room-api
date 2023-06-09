import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DeepPartial, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomEntity } from '../../../src/entity/room.entity';
import { CreateRoomDTO } from '../../../src/dto/RoomDTO/create-room.dto';
import { UpdateRoomDTO } from '../../../src/dto/RoomDTO/update-room.dto';
import { RoomDTO } from '../../../src/dto/RoomDTO/room.dto';
import { RoomService } from '../../../src/rooms/room.service';

describe('RoomService', () => {
  let roomService: RoomService;
  let roomRepository: Repository<RoomEntity>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        RoomService,
        {
          provide: getRepositoryToken(RoomEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    roomService = moduleRef.get<RoomService>(RoomService);
    roomRepository = moduleRef.get<Repository<RoomEntity>>(
      getRepositoryToken(RoomEntity),
    );
  });

  describe('createRoom', () => {
    it('Nên tạo ra 1 room mới', async () => {
      const createRoom: CreateRoomDTO = {
        name: 'Phòng 1',
      };
      const saveSpy = jest
        .spyOn(roomRepository, 'save')
        .mockResolvedValueOnce(
          createRoom as DeepPartial<RoomEntity> & RoomEntity,
        );
      const result = await roomService.createRoom(createRoom);
      expect(roomRepository.save).toHaveBeenCalledWith(createRoom);
      expect(result).toEqual(plainToClass(CreateRoomDTO, createRoom));
    });

    it('Trả ra thông báo nếu bị trùng lặp dữ liệu', async () => {
      const createRoom: CreateRoomDTO = {
        name: 'Phòng 1',
      };
      const saveSpy = jest.spyOn(roomRepository, 'save').mockRejectedValueOnce({
        code: 'ER_DUP_ENTRY',
      });
      await expect(roomService.createRoom(createRoom)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('updateRoom', () => {
    it('Nên hoàn thành chỉnh sửa thông tin room', async () => {
      const id = 1;
      const updateRoom: UpdateRoomDTO = {
        name: 'Phòng 1',
      };
      const findOneSpy = jest
        .spyOn(roomService, 'findOneByID')
        .mockResolvedValueOnce({} as RoomDTO);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockResolvedValueOnce({} as any);
      const result = await roomService.updateRoom(id, updateRoom);
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(roomRepository.update).toHaveBeenCalledWith(id, updateRoom);
      expect(result).toEqual(plainToClass(UpdateRoomDTO, updateRoom));
    });

    it('Trả ra thông tin nếu thông tin chỉnh sửa bị trùng lặp', async () => {
      const id = 1;
      const updateRoom: UpdateRoomDTO = {
        name: 'Phòng 1',
      };
      const findOneSpy = jest
        .spyOn(roomService, 'findOneByID')
        .mockResolvedValueOnce({} as RoomDTO);
      const updateSpy = jest
        .spyOn(roomRepository, 'update')
        .mockRejectedValueOnce({
          code: 'ER_DUP_ENTRY',
        });
      await expect(roomService.updateRoom(id, updateRoom)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        ),
      );
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(roomRepository.update).toHaveBeenCalledWith(id, updateRoom);
    });
  });

  describe('findOneByID', () => {
    it('Tìm thấy phòng họp cần tìm theo id', async () => {
      const id = 1;
      const roomDTO: RoomDTO = {
        id: 5,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        name: 'Phòng 1',
      };
      const findOneSpy = jest
        .spyOn(roomRepository, 'findOne')
        .mockResolvedValueOnce(roomDTO as RoomEntity | Promise<RoomEntity>);
      const result = await roomService.findOneByID(id);
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(roomDTO);
    });

    it('Trả ra thông tin nếu không tìm thấy', async () => {
      const id = 1;

      const findOneSpy = jest
        .spyOn(roomRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await expect(roomService.findOneByID(id)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(roomRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('deleteRoom', () => {
    it('Nên xoá phòng họp thành công', async () => {
      const id = 1;
      const findOneSpy = jest
        .spyOn(roomService, 'findOneByID')
        .mockResolvedValueOnce({} as RoomDTO);
      const softDeleteSpy = jest
        .spyOn(roomRepository, 'softDelete')
        .mockResolvedValueOnce(undefined);
      const result = await roomService.deleteRoom(id);
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
