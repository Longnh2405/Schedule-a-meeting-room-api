import { Expose } from 'class-transformer';
import { MysqlBaseDTO } from '../../../src/common/base.dto';

export class MeetingRoomDTO extends MysqlBaseDTO {
  @Expose()
  id: number;

  @Expose()
  room_id: number;

  @Expose()
  start_time: string;

  @Expose()
  end_time: string;

  @Expose()
  status: number;
}
