import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from '../entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async findAll() {
    return this.roomRepository.find({ order: { id: 'DESC' } });
  }

  async findAvailable() {
    return this.roomRepository.find({
      where: { status: RoomStatus.AVAILABLE },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.roomRepository.findOne({ where: { id } });
  }

  async create(roomData: Partial<Room>) {
    const room = this.roomRepository.create(roomData);
    return this.roomRepository.save(room);
  }

  async update(id: number, roomData: Partial<Room>) {
    await this.roomRepository.update(id, roomData);
    return this.findOne(id);
  }

  async delete(id: number) {
    return this.roomRepository.delete(id);
  }
}
