import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateMeetingRoomDTO {
  @IsNotEmpty()
  room_id: number;

  @IsNotEmpty()
  start_time: Date;

  @IsNotEmpty()
  end_time: Date;
}
