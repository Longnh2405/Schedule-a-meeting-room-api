import { Expose } from "class-transformer";
import { MysqlBaseDTO } from "src/common/base.dto";

export class TeamDTO extends MysqlBaseDTO{
    @Expose()
    name: string
}