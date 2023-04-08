import { BaseEntity } from 'src/common/mysql/base.entity';
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

enum UserRole {
  ADMIN = 1,
  BACKOFFICE = 2,
  USER = 3,
}
// enum Status {
//   AVAILABLE = 1,
//   BOOKED = 2,
// }

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity{

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
}



// @Entity({
//   name: 'team',
// })
// export class Team {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   name: string;
// }

// @Entity({
//   name: 'metting',
// })
// export class Meeting {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   time: string;

//   @Column()
//   content: string;

//   @Column()
//   user_id: number;

//   @Column()
//   room_id: number;

//   @Column()
//   team_id: number;
// }
