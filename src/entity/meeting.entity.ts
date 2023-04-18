import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { TeamEntity } from './team.entity';
import { MeetingRoomEntity } from './meeting_room.entity';

@Entity('meetings')
export class MeetingEntity extends BaseEntity {
  @Column()
  meeting_room_id: number;

  @Column()
  content: string;

  @Column()
  user_id: number;

  @Column()
  team_id: number;

  @ManyToOne(() => UserEntity, (user) => user.meeting)
  @JoinColumn({ name: 'user_id' }) // Tên cột khoá ngoại trong bảng ChildEntity
  user: UserEntity;

  @ManyToOne(() => TeamEntity, (team) => team.meeting)
  @JoinColumn({ name: 'team_id' }) // Tên cột khoá ngoại trong bảng ChildEntity
  team: TeamEntity;

  @OneToOne(() => MeetingRoomEntity, (meetingRoom) => meetingRoom.meeting)
  @JoinColumn({ name: 'meeting_room_id' })
  meetingRoom: MeetingRoomEntity;
}
