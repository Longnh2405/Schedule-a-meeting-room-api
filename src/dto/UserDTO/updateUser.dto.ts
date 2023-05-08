import { IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty()
  username: string;

  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    { message: 'Password is not valid' },
  )
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string | null;
}
