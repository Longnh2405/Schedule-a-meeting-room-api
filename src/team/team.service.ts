
import { MysqlBaseService } from "src/common/mysql/base.service";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { TeamDTO } from "src/dto/team.dto";
import { TeamEntity } from "src/entity/team.entity";


export class TeamService extends MysqlBaseService<TeamEntity,TeamDTO>{
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>
    ){
        super(teamRepository);
    }
    async existTeam(id: number): Promise<TeamDTO>{
        const options: FindOneOptions ={
            where: {id}
        }
        const check =  await this.teamRepository.findOne(options)
        return check
    }
}