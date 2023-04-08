import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TeamService } from "./team.service";
import { TeamEntity } from "../entity/team.entity";
import { TeamDTO } from "../dto/team.dto";


@Controller('team')

export class TeamController{
    constructor(
        private readonly teamService: TeamService
    ){}
    
    @Post('create')
    createTeam(@Body() team: TeamEntity): Promise<TeamDTO>{
        return this.teamService.save(team)
    }
    @Put('update/:id')
    updateTeam(@Param('id') id : number, @Body() team: TeamEntity): Promise<TeamDTO>{
        return this.teamService.update(id,team)
    }
    @Get('get/:id')
    getTeam(@Param('id') id : number): Promise<TeamDTO>{
        return this.teamService.get(id)
    }
    @Delete('delete/:id')
    deleteTeam(@Param('id') id: number): Promise<void>{
        return this.teamService.remove(id)
    }

    @Get(':id/exist')
    async testlength(@Param('id') id: number):Promise<TeamDTO>{
        return  this.teamService.existTeam(id)
    }
}