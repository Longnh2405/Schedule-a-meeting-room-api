import { BaseEntity } from "src/common/mysql/base.entity";
import { Column, Entity } from "typeorm";


@Entity('team')
export class TeamEntity extends BaseEntity{

    @Column()
    name: string;
}