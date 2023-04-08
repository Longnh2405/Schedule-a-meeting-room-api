
import { BaseEntity } from "src/common/mysql/base.entity";
import { Column, Entity, Index } from "typeorm";

enum Status {
    AVAILABLE = 1,
    BOOKED = 2,
  }

@Entity({
    name: 'room',
  })
  export class RoomEntity extends BaseEntity{
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
  }