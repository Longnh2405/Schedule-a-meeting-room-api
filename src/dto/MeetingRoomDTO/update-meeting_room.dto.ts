import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMeetingRoomDTO {
  @IsNotEmpty()
  room_id: number;

  @IsOptional()
  start_time: Date | null;

  @IsOptional()
  end_time: Date | null;

  @IsOptional()
  status: number | null;
}
