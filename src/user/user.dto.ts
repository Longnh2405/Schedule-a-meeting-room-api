import { Expose } from 'class-transformer';
import { MysqlBaseDTO } from 'src/common/base.dto';


export class UserDTO extends MysqlBaseDTO {
  @Expose()
  id: number;

  @Expose()
  username: string;

  password: string;

  type: number;
}
