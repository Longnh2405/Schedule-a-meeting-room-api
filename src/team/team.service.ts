import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { TeamDTO } from 'src/dto/team.dto';
import { TeamEntity } from 'src/entity/team.entity';
import { Repository } from 'typeorm';

export class TeamService extends MysqlBaseService<TeamEntity, TeamDTO> {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {
    super(teamRepository);
  }
}
