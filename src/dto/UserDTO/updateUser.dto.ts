import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;
}
