import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { MysqlBaseDTO } from "src/common/base.dto";

export class TeamDTO extends MysqlBaseDTO{
    @Expose()
    id: number;
    
    @Expose()
    name: string
}