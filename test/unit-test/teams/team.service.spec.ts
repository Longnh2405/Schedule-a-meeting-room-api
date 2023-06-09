import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { DeepPartial, Repository } from 'typeorm';

import { TeamDTO } from '../../../src/dto/TeamDTO/team.dto';
import { TeamEntity } from '../../../src/entity/team.entity';
import { TeamService } from '../../../src/teams/team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTeamDTO } from '../../../src/dto/TeamDTO/create-team.dto';
import { UpdateTeamDTO } from '../../../src/dto/TeamDTO/update-team.dto';

describe('TeamService', () => {
  let teamService: TeamService;
  let teamRepository: Repository<TeamEntity>;
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(TeamEntity),
          useClass: Repository,
        },
      ],
    }).compile();
    teamService = moduleRef.get<TeamService>(TeamService);
    teamRepository = moduleRef.get<Repository<TeamEntity>>(
      getRepositoryToken(TeamEntity),
    );
  });

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const createTeamDTO: CreateTeamDTO = {
        name: 'Nhóm 1',
      };
      const saveSpy = jest
        .spyOn(teamRepository, 'save')
        .mockResolvedValueOnce(
          createTeamDTO as DeepPartial<TeamEntity> & TeamEntity,
        );
      const result = await teamService.createTeam(createTeamDTO);
      expect(teamRepository.save).toHaveBeenCalledWith(createTeamDTO);
      expect(result).toEqual(plainToClass(CreateTeamDTO, createTeamDTO));
    });

    it('should throw a conflict exception when duplicate entry exists', async () => {
      const createTeamDTO: CreateTeamDTO = {
        name: 'Nhóm 1',
      };
      const saveSpy = jest.spyOn(teamRepository, 'save').mockRejectedValueOnce({
        code: 'ER_DUP_ENTRY',
      });
      await expect(teamService.createTeam(createTeamDTO)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        ),
      );
    });
  });

  describe('updateTeam', () => {
    it('should update an existing team', async () => {
      const id = 1;
      const updateTeamDTO: UpdateTeamDTO = {
        name: 'Nhóm 1',
      };
      const findOneSpy = jest
        .spyOn(teamService, 'findOneByID')
        .mockResolvedValueOnce({} as TeamDTO);
      const updateSpy = jest
        .spyOn(teamRepository, 'update')
        .mockResolvedValueOnce({} as any);
      const result = await teamService.updateTeam(id, updateTeamDTO);
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(teamRepository.update).toHaveBeenCalledWith(id, updateTeamDTO);
      expect(result).toEqual(plainToClass(UpdateTeamDTO, updateTeamDTO));
    });

    it('should throw a conflict exception when duplicate entry exists', async () => {
      const id = 1;
      const updateTeamDTO: UpdateTeamDTO = {
        name: 'Nhóm 1',
      };
      const findOneSpy = jest
        .spyOn(teamService, 'findOneByID')
        .mockResolvedValueOnce({} as TeamDTO);
      const updateSpy = jest
        .spyOn(teamRepository, 'update')
        .mockRejectedValueOnce({
          code: 'ER_DUP_ENTRY',
        });
      await expect(teamService.updateTeam(id, updateTeamDTO)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.CONFLICT,
            success: false,
            message: 'CONFLICT DATA',
          },
          HttpStatus.CONFLICT,
        ),
      );
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(teamRepository.update).toHaveBeenCalledWith(id, updateTeamDTO);
    });
  });

  describe('findOneByID', () => {
    it('should find a team by ID', async () => {
      const id = 1;
      const teamDTO: TeamDTO = {
        id: 5,
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: new Date(),
        name: 'Nhóm 1',
      };
      const findOneSpy = jest
        .spyOn(teamRepository, 'findOne')
        .mockResolvedValueOnce(teamDTO as TeamEntity | Promise<TeamEntity>);
      const result = await teamService.findOneByID(id);
      expect(teamRepository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(teamDTO);
    });

    it('should throw a not found exception when team is not found', async () => {
      const id = 1;

      const findOneSpy = jest
        .spyOn(teamRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await expect(teamService.findOneByID(id)).rejects.toThrow(
        new HttpException(
          {
            code: HttpStatus.NOT_FOUND,
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(teamRepository.findOne).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('deleteTeam', () => {
    it('should delete an existing team', async () => {
      const id = 1;
      const findOneSpy = jest
        .spyOn(teamService, 'findOneByID')
        .mockResolvedValueOnce({} as TeamDTO);
      const softDeleteSpy = jest
        .spyOn(teamRepository, 'softDelete')
        .mockResolvedValueOnce(undefined);
      const result = await teamService.deleteTeam(id);
      expect(findOneSpy).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
