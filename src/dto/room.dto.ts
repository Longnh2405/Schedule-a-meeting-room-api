import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { MysqlBaseDTO } from "src/common/base.dto";

export class RoomDTO extends MysqlBaseDTO{
    @Expose()
    id: number;

    // @IsNotEmpty()
    @Expose()
    name: string;

    @Expose()
    status: number;
}