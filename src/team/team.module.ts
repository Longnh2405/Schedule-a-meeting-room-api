import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TeamEntity } from "../entity/team.entity";
import { BaseEntity } from "typeorm";
import { TeamService } from "./team.service";
import { TeamController } from "./team.controller";

@Module({
    imports: [TypeOrmModule.forFeature([TeamEntity,BaseEntity])],
    providers: [TeamService],
    controllers: [TeamController]
})
export class TeamModule{

}