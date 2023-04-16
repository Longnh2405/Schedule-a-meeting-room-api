import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { MeetingRoomDTO } from 'src/dto/meeting_room.dto';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { Repository } from 'typeorm';

export class MeetingRoomService extends MysqlBaseService<
  MeetingRoomEntity,
  MeetingRoomDTO
> {
  constructor(
    @InjectRepository(MeetingRoomEntity)
    private readonly meetingRoom: Repository<MeetingRoomEntity>,
  ) {
    super(meetingRoom);
  }
}
