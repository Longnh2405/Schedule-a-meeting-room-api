import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { zonedTimeToUtc } from 'date-fns-tz';
import { CreateMeetingRoomDTO } from 'src/dto/MeetingRoomDTO/create-meeting_room.dto';
import { MeetingRoomDTO } from 'src/dto/MeetingRoomDTO/meeting-room.dto';
import { UpdateMeetingRoomDTO } from 'src/dto/MeetingRoomDTO/update-meeting_room.dto';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { resolveError } from 'src/error/error';
import {
  FindOneOptions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { MINIMUM_DURATION } from './constant';

@Injectable()
export class MeetingRoomService {
  constructor(
    @InjectRepository(MeetingRoomEntity)
    private readonly meetingRoomRepository: Repository<MeetingRoomEntity>,
  ) {}

  async createMeetingRoom(
    meetingRoom: CreateMeetingRoomDTO,
  ): Promise<MeetingRoomDTO> {
    try {
      const { start_time, end_time, room_id } = meetingRoom;
      const conflictingMeeting = await this.meetingRoomRepository.findOne({
        where: [
          {
            room_id: room_id,
            start_time: LessThanOrEqual(end_time),
            end_time: MoreThanOrEqual(start_time),
          },
        ],
      });
      if (
        start_time >= end_time ||
        conflictingMeeting !== null ||
        new Date(end_time).getTime() - new Date(start_time).getTime() <
          MINIMUM_DURATION
      ) {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: `Thời gian không hợp lệ`,
          },
          HttpStatus.CONFLICT,
        );
      }
      const createMeetingRoom = await this.meetingRoomRepository.save(
        meetingRoom,
      );

      return plainToInstance(MeetingRoomDTO, createMeetingRoom, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      resolveError(error);
    }
  }

  async findOneByID(id: number): Promise<MeetingRoomDTO> {
    try {
      const options: FindOneOptions = {
        where: {
          id,
        },
      };
      const meetingRoom = await this.meetingRoomRepository.findOne(options);
      if (!meetingRoom) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return plainToInstance(MeetingRoomDTO, meetingRoom, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      resolveError(error);
    }
  }

  async updateMeetingRoom(
    id: number,
    updateMeetingRoom: UpdateMeetingRoomDTO,
  ): Promise<UpdateMeetingRoomDTO> {
    try {
      const meetingRoom = await this.findOneByID(id);
      const { start_time, end_time, room_id } = updateMeetingRoom;
      const isTimeRangeValid = function (
        conflict,
        id,
        start_time,
        end_time,
      ): Boolean {
        return (
          (conflict === null &&
            new Date(end_time).getTime() - new Date(start_time).getTime() >=
              MINIMUM_DURATION) ||
          (conflict !== null &&
            Number(id) === conflict.id &&
            new Date(end_time).getTime() - new Date(start_time).getTime() >=
              MINIMUM_DURATION)
        );
      };

      // kiểm tra có truyền vào thời gian mới để sửa hay không, nếu không thì dùng lại thời gian cũ
      //=====================================
      if (start_time === null && end_time === null) {
        const checkConflictMeeting = await this.meetingRoomRepository.findOne({
          where: [
            {
              room_id: room_id,
              start_time: LessThanOrEqual(new Date(meetingRoom.end_time)),
              end_time: MoreThanOrEqual(new Date(meetingRoom.start_time)),
            },
          ],
        });
        if (
          await isTimeRangeValid(
            checkConflictMeeting,
            id,
            meetingRoom.start_time,
            meetingRoom.end_time,
          )
        ) {
          updateMeetingRoom.start_time = new Date(meetingRoom.start_time);
          updateMeetingRoom.end_time = new Date(meetingRoom.end_time);
          await this.meetingRoomRepository.update(id, updateMeetingRoom);
          return plainToInstance(UpdateMeetingRoomDTO, updateMeetingRoom, {
            exposeDefaultValues: true,
          });
        } else {
          throw new HttpException(
            {
              code: HttpStatus.CONFLICT,
              success: false,
              message: `Đã tồn tại thời gian với phòng ${room_id}`,
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      // kiểm tra nếu không sửa thời gian bắt đầu, chỉ sửa thời gian kết thúc
      //===============================================
      if (start_time === null && end_time !== null) {
        const checkConflictMeetingByStartTime =
          await this.meetingRoomRepository.findOne({
            where: [
              {
                room_id: room_id,
                start_time: LessThanOrEqual(end_time),
                end_time: MoreThanOrEqual(new Date(meetingRoom.start_time)),
              },
            ],
          });
        const outputStartTime = zonedTimeToUtc(meetingRoom.start_time, 'GMT+0');
        if (
          await isTimeRangeValid(
            checkConflictMeetingByStartTime,
            id,
            outputStartTime,
            end_time,
          )
        ) {
          updateMeetingRoom.start_time = new Date(meetingRoom.start_time);
          await this.meetingRoomRepository.update(id, updateMeetingRoom);
          return plainToInstance(UpdateMeetingRoomDTO, updateMeetingRoom, {
            exposeDefaultValues: true,
          });
        } else {
          throw new HttpException(
            {
              code: HttpStatus.CONFLICT,
              success: false,
              message: 'Thời gian không hợp lệ',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      // kiểm tra không nhập vào thời gian kết thúc, chỉ nhập vào thời gian bắt đầu
      //===============================================
      if (end_time === null && start_time !== null) {
        const checkConflictMeetingByEndTime =
          await this.meetingRoomRepository.findOne({
            where: [
              {
                room_id: room_id,
                start_time: LessThanOrEqual(new Date(meetingRoom.end_time)),
                end_time: MoreThanOrEqual(start_time),
              },
            ],
          });
        const outputEndTime = zonedTimeToUtc(meetingRoom.end_time, 'GMT+0');
        if (
          await isTimeRangeValid(
            checkConflictMeetingByEndTime,
            id,
            start_time,
            outputEndTime,
          )
        ) {
          updateMeetingRoom.end_time = new Date(meetingRoom.end_time);
          await this.meetingRoomRepository.update(id, updateMeetingRoom);
          return plainToInstance(UpdateMeetingRoomDTO, updateMeetingRoom, {
            exposeDefaultValues: true,
          });
        } else {
          throw new HttpException(
            {
              code: HttpStatus.CONFLICT,
              success: false,
              message: 'Thời gian không hợp lệ',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
      //===============================================
      const conflictingMeeting = await this.meetingRoomRepository.findOne({
        where: [
          {
            room_id: room_id,
            start_time: LessThanOrEqual(end_time),
            end_time: MoreThanOrEqual(start_time),
          },
        ],
      });
      if (
        await isTimeRangeValid(conflictingMeeting, id, start_time, end_time)
      ) {
        await this.meetingRoomRepository.update(id, updateMeetingRoom);
        return plainToInstance(UpdateMeetingRoomDTO, updateMeetingRoom, {
          exposeDefaultValues: true,
        });
      } else {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'Thời gian không hợp lệ',
          },
          HttpStatus.CONFLICT,
        );
      }
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

  async deleteMeetingRoom(id: number): Promise<void> {
    try {
      await this.findOneByID(id);
      await this.meetingRoomRepository.softDelete(id);
    } catch (error) {
      resolveError(error);
    }
  }

  // hiển thị thời gian trống của phòng cho user
  async getMeetingRoomForUser(room_id: number): Promise<MeetingRoomDTO[]> {
    try {
      const options = {
        where: {
          room_id,
          status: 1,
        },
      };
      const meetingRoom = await this.meetingRoomRepository.find(options);
      if (!meetingRoom) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return plainToInstance(MeetingRoomDTO, meetingRoom, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      resolveError(error);
    }
  }
}
