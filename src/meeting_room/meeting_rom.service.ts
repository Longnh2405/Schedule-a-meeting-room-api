import { InjectRepository } from '@nestjs/typeorm';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { MeetingRoomDTO } from 'src/dto/meeting_room.dto';
import { MeetingRoomEntity } from 'src/entity/meeting_room.entity';
import { FindOneOptions, Repository } from 'typeorm';

export class MeetingRoomService extends MysqlBaseService<
    MeetingRoomEntity,
    MeetingRoomDTO
> {
    constructor(
        @InjectRepository(MeetingRoomEntity)
        private readonly meetingRoom: Repository<MeetingRoomEntity>,
    ) {
        super(meetingRoom);
    }

    // Kiểm tra xem meeting-room có tồn tại hay không, trả về 1 nếu có, 0 nếu không tồn tại
    async existMeetingRoom(id: number): Promise<number> {
        const options: FindOneOptions = {
            where: { id },
        };
        const check = await this.meetingRoom.findOne(options);
        if (check) {
            return 1;
        } else {
            return 0;
        }
    }
    //Lấy ra danh sách tất cả các meeting-room 
    async allMeetingRoom(user_id: number): Promise<MeetingRoomDTO[]> {
        const check = await this.meetingRoom.find();
        return check;
    }
    // Tìm tất cả các meeting-room đang ở trạng thái trống
    async availableMeetingRoom(user_id: number): Promise<MeetingRoomDTO[]> {
        const options = {
            where: { status: 1 },
        };
        const check = await this.meetingRoom.find(options);
        return check;
    }
    // Tìm meeting-room theo id để phục vụ hàm thay đổi trạng thái
    async findMeetingRomByID(id: number): Promise<MeetingRoomDTO> {
        const options: FindOneOptions = {
            where: {
                id: id,
            },
        };
        const check = await this.meetingRoom.findOne(options);
        return check;
    }

    // check xem có tồn tại và đang trống hay không
    async checkExistMeetingRoomID(
        meeting_room_id: number,
    ): Promise<MeetingRoomDTO> {
        const options: FindOneOptions = {
            where: { status: 1, id: meeting_room_id },
        };
        const check = await this.meetingRoom.findOne(options);
        return check;
    }
    // thay đổi trạng thái của meeting-room 
    async updateStatusMeetingRoom(meeting_room_id: number) {
        const findMeetingRoom = await this.findMeetingRomByID(meeting_room_id);
        if (findMeetingRoom.status === 1) {
            findMeetingRoom.status = 2;
            await this.meetingRoom.update(
                meeting_room_id,
                findMeetingRoom,
            );
            return console.log('Thay đổi status trong bảng Meeting-Room thành 2 thành công!');
        } else if (findMeetingRoom.status === 2) {
            findMeetingRoom.status = 1;
            await this.meetingRoom.update(
                meeting_room_id,
                findMeetingRoom,
            );
            return console.log('Thay đổi status trong bảng Meeting-Room thành 1 thành công!');
        }
    }
}
