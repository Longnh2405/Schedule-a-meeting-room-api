import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateTeamDTO } from 'src/dto/TeamDTO/create-team.dto';
import { UpdateTeamDTO } from 'src/dto/TeamDTO/update-team.dto';
import { TeamService } from './team.service';

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @UseGuards(AdminGuard)
  @Post()
  async createTeam(
    @Body() team: CreateTeamDTO,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.teamService.createTeam(team);
    res.status(HttpStatus.OK).send(`
    {
        code: ${HttpStatus.OK},
        success: true,
        message: "Thêm team thành công"
    }`);
  }

  @UseGuards(AdminGuard)
  @Put('/:id')
  async updateTeam(
    @Param('id') id: number,
    @Body() team: UpdateTeamDTO,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.teamService.updateTeam(id, team);
    const newTeam = await this.teamService.findOneByID(id);
    res.status(HttpStatus.OK).send({
      name: newTeam.name,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getTeam(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    const team = await this.teamService.findOneByID(id);
    res.status(HttpStatus.OK).send(team);
  }

  @UseGuards(AdminGuard)
  @Delete('/:id')
  async deleteTeam(
    @Param('id') id: number,
    @Res() res: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.teamService.deleteTeam(id);
    res.status(HttpStatus.OK).send(`
    {
        "code": ${HttpStatus.OK},
        "success": true,
        "message": "Xoá thành công"
    }`);
  }
}
