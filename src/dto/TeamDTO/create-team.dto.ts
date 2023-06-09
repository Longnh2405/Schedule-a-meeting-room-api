import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateTeamDTO {
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
