import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { MysqlBaseDTO } from "src/common/base.dto";


export class MeetingRoomDTO extends MysqlBaseDTO{
    // @IsNotEmpty()
    @Expose()
    room_id: number

    @Expose()
    start_time: Date

    @Expose()
    end_time: Date

    @Expose()
    status: number;
}
// MeetingRoomEntity {
//     id: 2,
//     created_at: 2023-04-07T09:03:48.209Z,
//     updated_at: 2023-04-08T10:16:54.079Z,
//     deleted_at: null,
//     meeting_room_id: 1,
//     start_time: 2022-04-04T07:00:00.000Z,
//     end_time: 2023-04-04T08:30:00.000Z,
//     status: 2
//   }
// {
//     "meeting_room_id": 1,
//     "content": "content",
//     "user_id": 1,
//     "team_id": 1
//     }