import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MeetingEntity } from './meeting.entity';

@Entity('teams')
export class TeamEntity extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => MeetingEntity, (meeting) => meeting.team_id)
  meeting: MeetingEntity[];
}
