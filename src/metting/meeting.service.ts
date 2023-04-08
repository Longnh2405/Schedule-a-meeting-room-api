import { MysqlBaseService } from "src/common/mysql/base.service";
import { MeetingEntity } from "../entity/meeting.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOneOptions, Repository } from "typeorm";
import { MeetingDTO } from "src/dto/meeting.dto";
import { plainToInstance } from "class-transformer";

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
    async FindMeetingWithMeetingRoomID(id: number, user_id:number):Promise<MeetingDTO>{
        const options: FindOneOptions = {
            where:{
                id: id,
                user_id: user_id,
            }
        }
        return this.meetingRepository.findOne(options)
    }
    async FindMeetingWithUserID(user_id: number):Promise<MeetingDTO[]>{
        const options = {
            where: {
                user_id : user_id,
            }
        }
        return await this.meetingRepository.find(options)
    }
    async FindAllMeeting(): Promise<MeetingDTO[]> {
        const meetings = await this.meetingRepository.find();
        return meetings.map(meeting => plainToInstance(MeetingDTO, meeting));
      }
}
export {MeetingService}