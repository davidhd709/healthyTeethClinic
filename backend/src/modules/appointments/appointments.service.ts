import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { endOfDay, parseDateOnly } from '../../common/utils/date.util';

export interface AppointmentFilters {
  status?: string;
  specialistId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async findAll(filters: AppointmentFilters = {}) {
    const query: Record<string, unknown> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.specialistId) {
      query.specialistId = filters.specialistId;
    }
    if (filters.serviceId) {
      query.serviceId = filters.serviceId;
    }
    if (filters.dateFrom || filters.dateTo) {
      const dateRange: Record<string, Date> = {};
      if (filters.dateFrom) {
        const parsedFrom = parseDateOnly(filters.dateFrom);
        if (!parsedFrom) {
          throw new BadRequestException(
            'Formato de dateFrom inválido. Usar YYYY-MM-DD',
          );
        }
        dateRange.$gte = parsedFrom;
      }
      if (filters.dateTo) {
        const parsedTo = parseDateOnly(filters.dateTo);
        if (!parsedTo) {
          throw new BadRequestException(
            'Formato de dateTo inválido. Usar YYYY-MM-DD',
          );
        }
        dateRange.$lte = endOfDay(parsedTo);
      }
      query.date = dateRange;
    }

    return this.appointmentModel
      .find(query)
      .populate('serviceId', 'name slug icon durationMinutes')
      .populate('specialistId', 'name slug photo specialty')
      .sort({ date: -1, time: -1 })
      .exec();
  }

  async findOne(id: string) {
    const appointment = await this.appointmentModel
      .findById(id)
      .populate('serviceId', 'name slug icon durationMinutes')
      .populate('specialistId', 'name slug photo specialty')
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada`);
    }
    return appointment;
  }

  async create(dto: CreateAppointmentDto) {
    const appointmentDate = parseDateOnly(dto.date);
    if (!appointmentDate) {
      throw new BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
    }

    // Check for conflicting appointments (same specialist, date, time, not cancelled)
    const conflict = await this.appointmentModel
      .findOne({
        specialistId: dto.specialistId,
        date: appointmentDate,
        time: dto.time,
        status: { $ne: 'cancelada' },
      })
      .exec();

    if (conflict) {
      throw new ConflictException(
        'Ya existe una cita para este especialista en la fecha y hora seleccionada',
      );
    }

    // Existing unique index includes cancelled records, so we clear cancelled duplicates first.
    await this.appointmentModel.deleteMany({
      specialistId: dto.specialistId,
      date: appointmentDate,
      time: dto.time,
      status: 'cancelada',
    });

    try {
      return await this.appointmentModel.create({
        ...dto,
        date: appointmentDate,
      });
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        (error as { code?: number }).code === 11000
      ) {
        throw new ConflictException(
          'Ya existe una cita para este especialista en la fecha y hora seleccionada',
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    const updateData: Record<string, unknown> = { ...dto };
    if (dto.date) {
      const parsedDate = parseDateOnly(dto.date);
      if (!parsedDate) {
        throw new BadRequestException('Formato de fecha inválido. Usar YYYY-MM-DD');
      }
      updateData.date = parsedDate;
    }

    const appointment = await this.appointmentModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada`);
    }
    return appointment;
  }

  async remove(id: string) {
    const appointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!appointment) {
      throw new NotFoundException(`Cita con ID "${id}" no encontrada`);
    }
    return appointment;
  }
}
