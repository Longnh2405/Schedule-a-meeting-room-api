import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateRoomDTO {
  @IsNotEmpty()
  @MinLength(3)
  name: string;
}
