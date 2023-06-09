import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CreateMeetingDTO } from 'src/dto/MeetingDTO/create-meeting.dto';
import { MeetingDTO, MeetingDTOForAdmin } from 'src/dto/MeetingDTO/meeting.dto';
import { UpdateMeetingDTO } from 'src/dto/MeetingDTO/update-meeting.dto';
import { MeetingEntity } from 'src/entity/meeting.entity';
import { resolveError } from 'src/error/error';
import { MeetingRoomService } from 'src/meeting-rooms/meeting-room.service';
import { RoomService } from 'src/rooms/room.service';
import { TeamService } from 'src/teams/team.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingRepository: Repository<MeetingEntity>,
    private meetingRoomService: MeetingRoomService,
    private teamService: TeamService,
    private roomService: RoomService,
  ) {}

  async createMeeting(
    meeting: CreateMeetingDTO,
    user_id: number,
  ): Promise<MeetingDTO> {
    try {
      const { team_id, meeting_room_id } = meeting;
      await this.meetingRoomService.findOneByID(meeting_room_id);
      await this.teamService.findOneByID(team_id);
      meeting.user_id = user_id;
      await this.meetingRepository.save(meeting);
      return plainToInstance(MeetingDTO, meeting, {
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
      } else resolveError(error);
    }
  }

  async updateMeeting(
    id: number,
    meeting: UpdateMeetingDTO,
  ): Promise<MeetingDTO> {
    try {
      const { team_id, meeting_room_id } = meeting;
      await this.meetingRoomService.findOneByID(meeting_room_id);
      await this.teamService.findOneByID(team_id);
      await this.meetingRepository.update(id, meeting);
      return plainToInstance(MeetingDTO, meeting, {
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
      } else resolveError(error);
    }
  }

  async FindOneByID(id: number): Promise<MeetingDTO> {
    try {
      const options: FindOneOptions = {
        where: {
          id,
        },
      };
      const meeting = await this.meetingRepository.findOne(options);
      if (!meeting) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return meeting;
    } catch (error) {
      resolveError(error);
    }
  }

  async deleteMeeting(id: number): Promise<void> {
    try {
      await this.meetingRepository.softDelete(id);
    } catch (error) {
      resolveError;
    }
  }

  async getMeetingForAdmin(room_id: number): Promise<MeetingDTOForAdmin[]> {
    try {
      await this.roomService.findOneByID(room_id);
      const meetings = await this.meetingRepository
        .createQueryBuilder('meeting')
        .select([
          'meeting.id',
          'meeting.user_id',
          'meeting.team_id',
          'meeting.meetingRoom',
        ])
        .leftJoinAndSelect('meeting.meetingRoom', 'meetingRoom')
        .where('meetingRoom.room_id = :room_id', { room_id })
        // .getRawMany();
        .getMany();
      if (!meetings) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return plainToInstance(MeetingDTOForAdmin, meetings, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      resolveError(error);
    }
  }
}
