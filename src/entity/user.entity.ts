import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { MeetingEntity } from './meeting.entity';

enum UserRole {
  ADMIN = 1,
  BACKOFFICE = 2,
  USER = 3,
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  type: UserRole;

  @OneToMany(() => MeetingEntity, (meeting) => meeting.user_id)
  meeting: MeetingEntity[];
}
