import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamEntity } from "./team.entity";
import { TeamDTO } from "./team.dto";
import { get } from "http";

@Controller('team')

export class TeamController{
    constructor(
        private readonly teamService: TeamService
    ){}
    
    @Post('create')
    createTeam(@Body() team: TeamEntity): Promise<TeamDTO>{
        return this.teamService.save(team)
    }
    @Put(':id')
    updateTeam(@Param('id') id : number, @Body() team: TeamEntity): Promise<TeamDTO>{
        return this.teamService.update(id,team)
    }
    @Get(':id')
    getTeam(@Param('id') id : number): Promise<TeamDTO>{
        return this.teamService.get(id)
    }
    @Delete(':id')
    deleteTeam(@Param('id') id: number): Promise<void>{
        return this.teamService.remove(id)
    }
}