import { Expose } from 'class-transformer';
import { MysqlBaseDTO } from 'src/common/base.dto';

export class MeetingDTO extends MysqlBaseDTO {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  meeting_room_id: number;

  @Expose()
  team_id: number;

  @Expose()
  content: string;
}

export class MeetingDTOForAdmin {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  room_id: number;

  @Expose()
  content: string;

  @Expose()
  meetingRoom: {
    team_id: number;

    start_time: string;

    end_time: string;
  };
}
