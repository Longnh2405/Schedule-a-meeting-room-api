import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMeetingDTO {
  @IsNotEmpty()
  meeting_room_id: number;

  @IsNotEmpty()
  team_id: number;

  @IsOptional()
  content: string;
}
