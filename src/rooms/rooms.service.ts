import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Room, RoomStatus } from '../entities/room.entity';
import { Booking } from '../entities/booking.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
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

  async findByRoomNumber(roomNumber: string) {
    return this.roomRepository.findOne({ where: { roomNumber } });
  }

  async searchRooms(query: string) {
    return this.roomRepository
      .createQueryBuilder('room')
      .where('room.roomNumber LIKE :query', { query: `%${query}%` })
      .orWhere('room.name LIKE :query', { query: `%${query}%` })
      .orWhere('room.type LIKE :query', { query: `%${query}%` })
      .orderBy('room.roomNumber', 'ASC')
      .getMany();
  }

  async checkRoomAvailability(roomNumber: string, checkInDate: Date, checkOutDate: Date) {
    const room = await this.findByRoomNumber(roomNumber);
    if (!room) {
      return { available: false, message: 'Room not found', room: null };
    }

    if (room.status !== RoomStatus.AVAILABLE) {
      return { available: false, message: `Room is ${room.status}`, room };
    }

    // Check if room has overlapping bookings
    const overlappingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId: room.id })
      .andWhere('booking.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('booking.checkOutDate > :checkInDate', { checkInDate })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'checked_in'] })
      .getMany();

    if (overlappingBookings.length > 0) {
      return { 
        available: false, 
        message: 'Room is booked for selected dates', 
        room,
        bookings: overlappingBookings
      };
    }

    return { available: true, message: 'Room is available', room };
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

  async findAvailableByDate(checkInDate: Date, checkOutDate: Date) {
    // Find all bookings that overlap with the requested date range
    const overlappingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.checkInDate < :checkOutDate', { checkOutDate })
      .andWhere('booking.checkOutDate > :checkInDate', { checkInDate })
      .andWhere('booking.status IN (:...statuses)', { statuses: ['confirmed', 'checked_in'] })
      .select('booking.roomId')
      .getRawMany();

    const bookedRoomIds = overlappingBookings.map(b => b.booking_roomId);

    // Find all available rooms that are not booked for the date range
    if (bookedRoomIds.length > 0) {
      return this.roomRepository.find({
        where: {
          status: RoomStatus.AVAILABLE,
          id: Not(In(bookedRoomIds)),
        },
        order: { id: 'DESC' },
      });
    }

    return this.findAvailable();
  }
}
