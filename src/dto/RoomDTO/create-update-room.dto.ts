import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateUpdateRoomDTO {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
