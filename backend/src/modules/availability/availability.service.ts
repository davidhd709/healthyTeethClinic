import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Specialist,
  SpecialistDocument,
} from '../specialists/schemas/specialist.schema';
import {
  Appointment,
  AppointmentDocument,
} from '../appointments/schemas/appointment.schema';
import { endOfDay, parseDateOnly } from '../../common/utils/date.util';

export interface TimeSlot {
  time: string;
  available: boolean;
}

@Injectable()
export class AvailabilityService {
  private readonly dayMap: Record<number, string> = {
    0: 'domingo',
    1: 'lunes',
    2: 'martes',
    3: 'miercoles',
    4: 'jueves',
    5: 'viernes',
    6: 'sabado',
  };

  constructor(
    @InjectModel(Specialist.name)
    private readonly specialistModel: Model<SpecialistDocument>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async getAvailability(specialistId: string, date: string) {
    // Validate date format
    const dateObj = parseDateOnly(date);
    if (!dateObj) {
      throw new BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
    }

    // Find specialist
    const specialist = await this.specialistModel.findById(specialistId).exec();
    if (!specialist) {
      throw new NotFoundException(
        `Especialista con ID "${specialistId}" no encontrado`,
      );
    }

    // Get the day of week in Spanish
    const dayOfWeek = this.dayMap[dateObj.getDay()];

    // Find matching schedule entry
    const schedule = specialist.weeklySchedule?.find(
      (s) => s.day === dayOfWeek,
    );

    if (!schedule) {
      return {
        specialist: specialist.name,
        date,
        slots: [],
      };
    }

    // Generate time slots
    const allSlots = this.generateTimeSlots(
      schedule.startTime,
      schedule.endTime,
      schedule.blockDuration,
      schedule.breaks || [],
    );

    // Find booked appointments for this specialist on this date
    const startOfDay = dateObj;
    const endDate = endOfDay(dateObj);

    const bookedAppointments = await this.appointmentModel
      .find({
        specialistId,
        date: { $gte: startOfDay, $lte: endDate },
        status: { $ne: 'cancelada' },
      })
      .exec();

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

    // Mark availability
    const slots: TimeSlot[] = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }));

    return {
      specialist: specialist.name,
      date,
      slots,
    };
  }

  private generateTimeSlots(
    startTime: string,
    endTime: string,
    blockDuration: number,
    breaks: Array<{ start: string; end: string }>,
  ): string[] {
    const slots: string[] = [];
    let current = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);

    while (current + blockDuration <= end) {
      const timeStr = this.minutesToTime(current);

      // Check if this slot falls within a break
      const inBreak = breaks.some((b) => {
        const breakStart = this.timeToMinutes(b.start);
        const breakEnd = this.timeToMinutes(b.end);
        return current >= breakStart && current < breakEnd;
      });

      if (!inBreak) {
        slots.push(timeStr);
      }

      current += blockDuration;
    }

    return slots;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }
}
