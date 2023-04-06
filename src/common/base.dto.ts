import { Expose } from 'class-transformer';


export class MysqlBaseDTO {

  @Expose()
  created_at:Date;

  @Expose()
  updated_at:Date;

  @Expose()
  deleted_at:Date;
}

export class DataDTO extends MysqlBaseDTO {

}