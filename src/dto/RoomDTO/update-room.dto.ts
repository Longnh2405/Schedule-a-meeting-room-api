import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateRoomDTO {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
