import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MeetingEntity } from './meeting.entity';

@Entity('teams')
export class TeamEntity extends BaseEntity {
  @Column()
  @Index({
    unique: true,
  })
  name: string;

  @OneToMany(() => MeetingEntity, (meeting) => meeting.team_id)
  meeting: MeetingEntity[];
}
