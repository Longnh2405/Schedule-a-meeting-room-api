import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { TeamDTO } from 'src/dto/TeamDTO/team.dto';
import { TeamEntity } from '../../src/entity/team.entity';
import { resolveError } from '../../src/error/error';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateTeamDTO } from '../../src/dto/TeamDTO/create-team.dto';
import { UpdateTeamDTO } from '../../src/dto/TeamDTO/update-team.dto';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepository: Repository<TeamEntity>,
  ) {}

  async createTeam(createTeam: CreateTeamDTO): Promise<CreateTeamDTO> {
    try {
      await this.teamRepository.save(createTeam);
      return plainToInstance(CreateTeamDTO, createTeam, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        resolveError(error);
      }
    }
  }

  async updateTeam(
    id: number,
    updateTeam: UpdateTeamDTO,
  ): Promise<UpdateTeamDTO> {
    try {
      await this.findOneByID(id);
      await this.teamRepository.update(id, updateTeam);
      return plainToInstance(UpdateTeamDTO, updateTeam, {
        exposeDefaultValues: true,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        resolveError(error);
      }
    }
  }

  async findOneByID(id: number): Promise<TeamDTO> {
    try {
      const options: FindOneOptions = {
        where: {
          id,
        },
      };
      const team = await this.teamRepository.findOne(options);
      if (!team) {
        throw new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return team;
    } catch (error) {
      resolveError(error);
    }
  }

  async deleteTeam(id: number): Promise<void> {
    try {
      await this.findOneByID(id);
      await this.teamRepository.softDelete(id);
    } catch (error) {
      resolveError(error);
    }
  }
}
