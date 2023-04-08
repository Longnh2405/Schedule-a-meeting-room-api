import { Injectable } from '@nestjs/common';
import { Any, FindOneOptions, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { plainToInstance } from 'class-transformer';
import { DataDTO } from '../base.dto';


@Injectable()
export class MysqlBaseService<dataEntity extends any, DataDTO> {
  constructor(protected repository: Repository<dataEntity>) {}

  async save(dataDTO: DataDTO): Promise<DataDTO> {
    const SaveUser = await this.repository.save(dataDTO as any);
    return plainToInstance(DataDTO as any, dataDTO, {
      exposeDefaultValues: true,
    });
  }

  async update(id: number, dataDTO: DataDTO): Promise<DataDTO> {
    const options: FindOneOptions = {
      where: { id },
    };
    const check = await this.repository.findOne(options);
    if (check !== null) {
      const updateUser = await this.repository.update(id, dataDTO as any);
      return plainToInstance(DataDTO as any, updateUser, {
        exposeDefaultValues: true,
      });
    } else {
      console.log(`Không tìm thấy!`);
    }
  }

  async get(id: number): Promise<DataDTO> {
    const options: FindOneOptions = {
      where: { id },
    };
    const check = await this.repository.findOne(options);
    if (check !== null) {
      console.log(`Hiển thị thông tin id = ${id}`);
      return check as any;
    } else {
      console.log(`Không tìm thấy!`);
    }
  }

  async remove(id: number): Promise<void> {
    const options: FindOneOptions = {
      where: { id },
    };
    const check = await this.repository.findOne(options);
    if (check !== null) {
      const deleteResult = await this.repository.softDelete(id);
      if (deleteResult.affected === 0) {
        console.log(`Xoá với id=  ${id} không thành công.`);
      } else {
        console.log(`Xoá với id = ${id} thành công.`);
      }
    } else {
      console.log(`Không tìm thấy !`);
    }
  }

  // async findAll(): Promise<DataDTO[]> {
  //   return (await this.repository.find()) as any;
  // }

  // async findOne(id: number): Promise<DataDTO> {
  //   const options: FindOneOptions = {
  //     where: { id },
  //   };
  //   return (await this.repository.findOne(options)) as any;
  // }
}
