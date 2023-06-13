import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import {
  Code,
  DeepPartial,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
  UpdateResult,
} from 'typeorm';
import { CreateMeetingRoomDTO } from '../../../src/dto/MeetingRoomDTO/create-meeting_room.dto';
import { MeetingRoomEntity } from '../../../src/entity/meeting_room.entity';
import { MeetingRoomService } from '../../../src/meeting-rooms/meeting-room.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MeetingRoomDTO } from '../../../src/dto/MeetingRoomDTO/meeting-room.dto';
import { UpdateMeetingRoomDTO } from '../../../src/dto/MeetingRoomDTO/update-meeting_room.dto';

describe('meeting_rooms-service', () => {
  let meetingRoomService: MeetingRoomService;
  let meetingRoomRepository: Repository<MeetingRoomEntity>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        MeetingRoomService,
        {
          provide: getRepositoryToken(MeetingRoomEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    meetingRoomService = moduleRef.get<MeetingRoomService>(MeetingRoomService);
    meetingRoomRepository = moduleRef.get<Repository<MeetingRoomEntity>>(
      getRepositoryToken(MeetingRoomEntity),
    );
  });
  describe('create meeting_rooms', () => {
    it('Tạo thành công meeting_rooms', async () => {
      const createMeetingRoomDTO: CreateMeetingRoomDTO = {
        room_id: 1,
        start_time: new Date('2022-05-30T00:00:00Z'),
        end_time: new Date('2022-05-30T01:00:00Z'),
      };
      const { room_id, start_time, end_time } = createMeetingRoomDTO;
      const options = {
        where: [
          {
            room_id: room_id,
            start_time: LessThanOrEqual(end_time),
            end_time: MoreThanOrEqual(start_time),
          },
        ],
      };
      const findOneSpy = jest
        .spyOn(meetingRoomRepository, 'findOne')
        .mockResolvedValue(
          null,
          //   createMeetingRoomDTO as
          //     | MeetingRoomEntity
          //     | Promise<MeetingRoomEntity>,
        );
      const saveSpy = jest
        .spyOn(meetingRoomRepository, 'save')
        .mockResolvedValue(
          createMeetingRoomDTO as DeepPartial<MeetingRoomEntity> &
            MeetingRoomEntity,
        );
      const result = await meetingRoomService.createMeetingRoom(
        createMeetingRoomDTO,
      );
      expect(result).toEqual(createMeetingRoomDTO);
      expect(meetingRoomRepository.save).toHaveBeenCalledWith(
        createMeetingRoomDTO,
      );
      expect(result).toEqual(
        plainToClass(CreateMeetingRoomDTO, createMeetingRoomDTO),
      );
    });

    it('Trả ra lỗi nếu trùng lặp dữ liệu hoặc sai thời gian', async () => {
      const createMeetingRoomDTO: CreateMeetingRoomDTO = {
        room_id: 1,
        start_time: new Date('2022-05-30T00:00:00Z'),
        end_time: new Date('2022-05-30T01:00:00Z'),
      };
      const { room_id, start_time, end_time } = createMeetingRoomDTO;
      const options = {
        where: [
          {
            room_id: room_id,
            start_time: LessThanOrEqual(end_time),
            end_time: MoreThanOrEqual(start_time),
          },
        ],
      };
      const findOneSpy = jest
        .spyOn(meetingRoomRepository, 'findOne')
        .mockResolvedValue(
          createMeetingRoomDTO as
            | MeetingRoomEntity
            | Promise<MeetingRoomEntity>,
        );
      const saveSpy = jest
        .spyOn(meetingRoomRepository, 'save')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      await expect(
        meetingRoomService.createMeetingRoom(createMeetingRoomDTO),
      ).rejects.toThrowError(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'Thời gian không hợp lệ',
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
  describe('findOneByID', () => {
    it('Tìm ra được 1 phòng phù hợp với id đưa vào', async () => {
      const id = 1;
      const createMeetingRoomDTO: CreateMeetingRoomDTO = {
        room_id: 1,
        start_time: new Date('2022-05-30T00:00:00Z'),
        end_time: new Date('2022-05-30T01:00:00Z'),
      };
      const findOneSpy = jest
        .spyOn(meetingRoomRepository, 'findOne')
        .mockResolvedValue(
          createMeetingRoomDTO as
            | MeetingRoomEntity
            | Promise<MeetingRoomEntity>,
        );
      const result = await meetingRoomService.findOneByID(id);
      expect(result).toEqual(
        plainToInstance(MeetingRoomDTO, createMeetingRoomDTO, {
          exposeDefaultValues: true,
        }),
      );
      expect(meetingRoomRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
        },
      });
    });

    it('Không tìm ra được phòng có id đưa vào', async () => {
      const id = 1;
      const findOneSpy = jest
        .spyOn(meetingRoomRepository, 'findOne')
        .mockResolvedValue(null);
      await expect(meetingRoomService.findOneByID(id)).rejects.toThrowError(
        new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('updateMeetingRoom', () => {
    it('should update a meeting room', async () => {
      const id = 1;
      const updateMeetingRoomDTO: UpdateMeetingRoomDTO = {
        room_id: 1,
        start_time: new Date('2022-05-30T00:00:00Z'),
        end_time: new Date('2022-05-30T01:00:00Z'),
        status: 1,
      };
      const expectedMeetingRoom: MeetingRoomDTO = {
        id: 1,
        room_id: 1,
        start_time: '2022-05-30T00:00:00Z',
        end_time: '2022-05-30T01:00:00Z',
        status: 1,
        created_at: new Date('2022-05-30T00:00:00Z'),
        updated_at: new Date('2022-05-30T00:00:00Z'),
        deleted_at: new Date('2022-05-30T00:00:00Z'),
      };
      const findOneSpy = jest
        .spyOn(meetingRoomRepository, 'findOne')
        .mockResolvedValue(null);
      const findOneByIDSpy = jest
        .spyOn(meetingRoomService, 'findOneByID')
        .mockResolvedValue(expectedMeetingRoom);
      const updateSpy = jest
        .spyOn(meetingRoomRepository, 'update')
        .mockResolvedValue({} as UpdateResult | Promise<UpdateResult>);
      const result = await meetingRoomService.updateMeetingRoom(
        id,
        updateMeetingRoomDTO,
      );
      expect(result).toEqual(
        plainToInstance(UpdateMeetingRoomDTO, updateMeetingRoomDTO, {
          exposeDefaultValues: true,
        }),
      );
      expect(meetingRoomService.findOneByID).toHaveBeenCalledWith(id);
      expect(meetingRoomRepository.update).toHaveBeenCalledWith(
        id,
        updateMeetingRoomDTO,
      );
    });

    it('Trả về lỗi nếu thời gian không hợp lệ', async () => {
      const id = 1;
      const updateMeetingRoomDTO: UpdateMeetingRoomDTO = {
        room_id: 1,
        start_time: new Date('2022-05-30T00:00:00Z'),
        end_time: new Date('2022-05-30T00:00:00Z'),
        status: 1,
      };
      const conflictingMeeting: MeetingRoomDTO = {
        id: 1,
        room_id: 1,
        start_time: '2022-05-30T00:00:00Z',
        end_time: '2022-05-30T01:00:00Z',
        status: 1,
        created_at: new Date('2022-05-30T00:00:00Z'),
        updated_at: new Date('2022-05-30T00:00:00Z'),
        deleted_at: new Date('2022-05-30T00:00:00Z'),
      };
      const findOneByIDSpy = jest
        .spyOn(meetingRoomService, 'findOneByID')
        .mockResolvedValue(conflictingMeeting);
      const updateSpy = jest
        .spyOn(meetingRoomRepository, 'update')
        .mockRejectedValue({ code: 'ER_DUP_ENTRY' });
      await expect(
        meetingRoomService.updateMeetingRoom(id, updateMeetingRoomDTO),
      ).rejects.toThrowError(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'Thời gian không hợp lệ',
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });
  describe('delete meetingRoom', () => {
    it('Nên xoá phòng họp thành công', async () => {
      const id = 1;
      const findOneSpy = jest
        .spyOn(meetingRoomService, 'findOneByID')
        .mockResolvedValueOnce({} as MeetingRoomDTO);
      const softDeleteSpy = jest
        .spyOn(meetingRoomRepository, 'softDelete')
        .mockResolvedValueOnce(undefined);
      const result = await meetingRoomService.deleteMeetingRoom(id);
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
