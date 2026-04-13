import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { endOfDay, parseDateOnly } from '../../common/utils/date.util';
import { EmailService } from '../integrations/email.service';
import { GoogleCalendarService } from '../integrations/google-calendar.service';
import { GoogleSheetsService } from '../integrations/google-sheets.service';

export interface AppointmentFilters {
  status?: string;
  specialistId?: string;
  serviceId?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    private readonly emailService: EmailService,
    private readonly calendarService: GoogleCalendarService,
    private readonly sheetsService: GoogleSheetsService,
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

    let created: AppointmentDocument;
    try {
      created = await this.appointmentModel.create({
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

    // Fire-and-forget integrations (do not block the response)
    void this.triggerIntegrations(created._id as unknown as string).catch((err) => {
      this.logger.error('Integration trigger failed', err);
    });

    return created;
  }

  private async triggerIntegrations(appointmentId: string): Promise<void> {
    const populated = await this.appointmentModel
      .findById(appointmentId)
      .populate<{ serviceId: { name: string; durationMinutes: number } }>(
        'serviceId',
        'name durationMinutes',
      )
      .populate<{ specialistId: { name: string } }>('specialistId', 'name')
      .exec();

    if (!populated) {
      this.logger.warn(`Could not populate appointment ${appointmentId} for integrations`);
      return;
    }

    const service = populated.serviceId as unknown as { name: string; durationMinutes: number };
    const specialist = populated.specialistId as unknown as { name: string };

    const dateIso = populated.date.toISOString().split('T')[0];
    const createdAtIso = (populated as unknown as { createdAt?: Date }).createdAt?.toISOString() ?? new Date().toISOString();

    // Run in parallel, all errors are swallowed by the individual services (they just log)
    await Promise.all([
      this.emailService.sendAppointmentConfirmation({
        patientName: populated.patientName,
        patientEmail: populated.patientEmail,
        serviceName: service.name,
        specialistName: specialist.name,
        date: dateIso,
        time: populated.time,
        clinicAddress: 'Calle 93 #12-45, Consultorio 301, Bogotá, Colombia',
        clinicPhone: '+57 601 555 0123',
      }),
      this.calendarService.createAppointmentEvent({
        patientName: populated.patientName,
        patientEmail: populated.patientEmail,
        patientPhone: populated.patientPhone,
        serviceName: service.name,
        serviceDurationMinutes: service.durationMinutes,
        specialistName: specialist.name,
        date: dateIso,
        time: populated.time,
        reasonForVisit: populated.reasonForVisit,
      }),
      this.sheetsService.appendAppointment({
        createdAt: createdAtIso,
        patientName: populated.patientName,
        patientEmail: populated.patientEmail,
        patientPhone: populated.patientPhone,
        patientDocument: populated.patientDocument,
        serviceName: service.name,
        specialistName: specialist.name,
        date: dateIso,
        time: populated.time,
        status: populated.status,
        reasonForVisit: populated.reasonForVisit,
      }),
    ]);
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
