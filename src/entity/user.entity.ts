import { BaseEntity } from '../../src/common/mysql/base.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MeetingEntity } from './meeting.entity';
import { UserRole } from './enum.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  @Index({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  type: UserRole;

  @Column({
    default: null,
  })
  authen_token: string;

  @OneToMany(() => MeetingEntity, (meeting) => meeting.user_id)
  meeting: MeetingEntity[];
}
