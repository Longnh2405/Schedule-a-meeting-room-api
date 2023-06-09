import { BaseEntity } from '../../src/common/mysql/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MeetingRoomEntity } from './meeting_room.entity';

@Entity('rooms')
export class RoomEntity extends BaseEntity {
  @Column()
  @Index({
    unique: true,
  })
  name: string;

  @OneToMany(() => MeetingRoomEntity, (meetingRoom) => meetingRoom.room_id)
  meetingRoom: MeetingRoomEntity[];
}
