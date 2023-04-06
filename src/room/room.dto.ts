import { Expose } from "class-transformer";
import { MysqlBaseDTO } from "src/common/base.dto";

export class RoomDTO extends MysqlBaseDTO{
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    status: number;
}