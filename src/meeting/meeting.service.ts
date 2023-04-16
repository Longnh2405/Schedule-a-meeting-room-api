import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { MeetingDTO } from 'src/dto/meeting.dto';
import { Repository } from 'typeorm';
import { MeetingEntity } from '../entity/meeting.entity';

class MeetingService extends MysqlBaseService<MeetingEntity, MeetingDTO> {
  constructor(
    @InjectRepository(MeetingEntity)
    private readonly meetingRepository: Repository<MeetingEntity>,
  ) {
    super(meetingRepository);
  }
}
export { MeetingService };
