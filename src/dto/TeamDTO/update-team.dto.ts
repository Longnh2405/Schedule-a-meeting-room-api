import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateTeamDTO {
  @IsNotEmpty()
  @MinLength(5)
  name: string;
}
