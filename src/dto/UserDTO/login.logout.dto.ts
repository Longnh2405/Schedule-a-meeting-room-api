import { Expose } from 'class-transformer';

export class LoginLogoutDTO {
  @Expose()
  username: string;

  @Expose()
  password: string;
}
