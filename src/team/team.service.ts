
import { MysqlBaseService } from "src/common/mysql/base.service";
import { TeamEntity } from "./team.entity";
import { TeamDTO } from "./team.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Body } from "@nestjs/common";
import { plainToInstance } from "class-transformer";


export class TeamService extends MysqlBaseService<TeamEntity,TeamDTO>{
    constructor(
        @InjectRepository(TeamEntity)
        private readonly teamRepository: Repository<TeamEntity>
    ){
        super(teamRepository);
    }
}