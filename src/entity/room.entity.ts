import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MeetingRoomEntity } from './meeting_room.entity';

enum Status {
  AVAILABLE = 1,
  BOOKED = 2,
}

@Entity('rooms')
export class RoomEntity extends BaseEntity {
  @Column()
  @Index({
    unique: true,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.AVAILABLE,
  })
  status: Status;

  @OneToMany(() => MeetingRoomEntity, (meetingRoom) => meetingRoom.room_id)
  meetingRoom: MeetingRoomEntity[];
}
