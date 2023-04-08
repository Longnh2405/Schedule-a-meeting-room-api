import { BaseEntity } from "src/common/mysql/base.entity";
import { Column, Entity } from "typeorm";


enum status {
    AVAILABLE = 1,
    BOOKED = 2,
  }

@Entity('meeting_room')
export class MeetingRoomEntity extends BaseEntity {
    @Column()
    room_id: number

    @Column({
        type: 'datetime',
        name: 'start_time',
    })
    start_time: Date

    @Column({
        type: 'datetime',
        name: 'end_time',
    })
    end_time: Date

    @Column({
      type: 'enum',
      enum: status,
      default: status.AVAILABLE,
    })
    status: status;
}

// MeetingRoomEntity {
//   id: 2,
//   created_at: 2023-04-07T09:03:48.209Z,
//   updated_at: 2023-04-08T10:16:54.079Z,
//   deleted_at: null,
//   meeting_room_id: 1,
//   start_time: 2022-04-04T07:00:00.000Z,
//   end_time: 2023-04-04T08:30:00.000Z,
//   status: 2
// }