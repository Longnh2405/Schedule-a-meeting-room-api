import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  )
  password: string;
}
