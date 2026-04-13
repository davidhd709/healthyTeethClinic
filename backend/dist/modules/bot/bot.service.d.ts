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
export declare class BotService {
    private readonly servicesService;
    private readonly specialistsService;
    private readonly availabilityService;
    private readonly appointmentsService;
    constructor(servicesService: ServicesService, specialistsService: SpecialistsService, availabilityService: AvailabilityService, appointmentsService: AppointmentsService);
    listServices(): Promise<BotServiceDto[]>;
    listSpecialists(serviceId?: string): Promise<BotSpecialistDto[]>;
    getAvailability(specialistId: string, date: string): Promise<{
        specialist: string;
        date: string;
        slots: import("../availability/availability.service").TimeSlot[];
    }>;
    createAppointment(dto: CreateAppointmentDto): Promise<{
        success: boolean;
        appointmentId: string;
        message: string;
        date: string;
        time: string;
    }>;
    formatServicesText(): Promise<string>;
    formatSpecialistsText(serviceId?: string): Promise<string>;
}
