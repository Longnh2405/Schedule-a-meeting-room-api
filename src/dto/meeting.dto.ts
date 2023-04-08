import { Expose } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { MysqlBaseDTO } from "src/common/base.dto";

export class MeetingDTO extends MysqlBaseDTO{
    @Expose()
    meeting_room_id: number

    @Expose()
    content: string

    @Expose()
    user_id: number
    
    @Expose()
    team_id: number
}