import { Injectable } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { SpecialistsService } from '../specialists/specialists.service';
import { AvailabilityService } from '../availability/availability.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';

export interface BotServiceDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  basePrice?: number;
}

export interface BotSpecialistDto {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  subspecialty?: string;
  experience: number;
  serviceIds: string[];
}

@Injectable()
export class BotService {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly specialistsService: SpecialistsService,
    private readonly availabilityService: AvailabilityService,
    private readonly appointmentsService: AppointmentsService,
  ) {}

  async listServices(): Promise<BotServiceDto[]> {
    const services = await this.servicesService.findAll();
    return services.map((s) => ({
      id: (s._id as unknown as string).toString(),
      name: s.name,
      slug: s.slug,
      description: s.description,
      durationMinutes: s.durationMinutes,
      basePrice: s.basePrice,
    }));
  }

  async listSpecialists(serviceId?: string): Promise<BotSpecialistDto[]> {
    const specialists = await this.specialistsService.findAll();

    const extractId = (svc: unknown): string => {
      if (typeof svc === 'string') return svc;
      if (svc && typeof svc === 'object') {
        const obj = svc as { _id?: unknown };
        if (obj._id) return String(obj._id);
      }
      return String(svc);
    };

    const filtered = serviceId
      ? specialists.filter((sp) =>
          sp.services.some((svc) => extractId(svc) === serviceId),
        )
      : specialists;

    return filtered.map((sp) => ({
      id: (sp._id as unknown as string).toString(),
      name: sp.name,
      slug: sp.slug,
      specialty: sp.specialty,
      subspecialty: sp.subspecialty,
      experience: sp.experience,
      serviceIds: sp.services.map((s) => extractId(s)),
    }));
  }

  async getAvailability(specialistId: string, date: string) {
    return this.availabilityService.getAvailability(specialistId, date);
  }

  async createAppointment(dto: CreateAppointmentDto) {
    const appointment = await this.appointmentsService.create(dto);
    return {
      success: true,
      appointmentId: (appointment._id as unknown as string).toString(),
      message: 'Cita agendada exitosamente. Recibirás un correo de confirmación.',
      date: dto.date,
      time: dto.time,
    };
  }

  async formatServicesText(): Promise<string> {
    const services = await this.listServices();
    if (services.length === 0) return 'No hay servicios disponibles.';
    return services
      .map(
        (s) =>
          `🦷 ${s.name} - ${s.durationMinutes} min${
            s.basePrice ? ` - desde $${s.basePrice.toLocaleString('es-CO')} COP` : ''
          }`,
      )
      .join('\n');
  }

  async formatSpecialistsText(serviceId?: string): Promise<string> {
    const specialists = await this.listSpecialists(serviceId);
    if (specialists.length === 0)
      return 'No hay especialistas disponibles para este servicio.';
    return specialists
      .map(
        (sp) =>
          `👨‍⚕️ ${sp.name} - ${sp.specialty}${
            sp.subspecialty ? ` (${sp.subspecialty})` : ''
          } - ${sp.experience} años`,
      )
      .join('\n');
  }
}
