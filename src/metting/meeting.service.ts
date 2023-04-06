import { MysqlBaseService } from "src/common/mysql/base.service";
import { MeetingEntity } from "./meeting.entity";
import { MeetingDTO } from "./meeting.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class MeetingService extends MysqlBaseService<MeetingEntity,MeetingDTO>{
    constructor(
        @InjectRepository(MeetingEntity)
        private readonly meetingRepository: Repository<MeetingEntity>
    ){
        super(meetingRepository);
    }
}