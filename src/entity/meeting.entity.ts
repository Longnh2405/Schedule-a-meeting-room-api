import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('Meeting')
export class MeetingEntity extends BaseEntity {
  @Column()
  meeting_room_id: number;

  @Column()
  content: string;

  @Column()
  user_id: number;

  @Column()
  team_id: number;
}
