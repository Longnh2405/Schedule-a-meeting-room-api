import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUpdateTeamDTO {
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
