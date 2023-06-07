import { BaseEntity } from '../common/mysql/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { RoomEntity } from './room.entity';
import { MeetingEntity } from './meeting.entity';
import { status } from './enum.entity';

@Entity('meeting_rooms')
export class MeetingRoomEntity extends BaseEntity {
  @Column()
  room_id: number;

  @Column({
    type: 'datetime',
    name: 'start_time',
  })
  start_time: Date;

  @Column({
    type: 'datetime',
    name: 'end_time',
  })
  end_time: Date;

  @Column({
    type: 'enum',
    enum: status,
    default: status.AVAILABLE,
  })
  status: status;

  @ManyToOne(() => RoomEntity, (room) => room.meetingRoom)
  @JoinColumn({ name: 'room_id' })
  room: RoomEntity;

  @OneToOne(() => MeetingEntity, (meeting) => meeting.meeting_room_id)
  meeting: MeetingEntity;
}
