import { MysqlBaseService } from "src/common/mysql/base.service";
import { MeetingEntity } from "../entity/meeting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOneOptions, Repository } from "typeorm";
import { MeetingDTO } from "src/dto/meeting.dto";

class MeetingService extends MysqlBaseService<MeetingEntity,MeetingDTO>{
    constructor(
        @InjectRepository(MeetingEntity)
        private readonly meetingRepository: Repository<MeetingEntity>
    ){
        super(meetingRepository);
    }

    async FindMeeting(id: number):Promise<MeetingDTO>{
        const options: FindOneOptions = {
            where:{
                id: id,
            }
        }
        return this.meetingRepository.findOne(options)
    }
}
export {MeetingService}