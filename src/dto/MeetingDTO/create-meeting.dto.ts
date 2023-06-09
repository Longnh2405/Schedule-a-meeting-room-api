import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMeetingDTO {
  @IsNotEmpty()
  meeting_room_id: number;

  @IsOptional()
  content: string;

  user_id: number;

  @IsNotEmpty()
  team_id: number;
}
