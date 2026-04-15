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
export interface BotBookingState {
    patientName?: string;
    patientEmail?: string;
    patientPhone?: string;
    patientDocument?: string;
    serviceId?: string;
    serviceName?: string;
    specialistId?: string;
    specialistName?: string;
    date?: string;
    time?: string;
    reasonForVisit?: string;
    dataConsent: boolean;
    appointmentId?: string;
}
export interface BotBookingTurnResponse {
    reply: string;
    state: BotBookingState;
    missingFields: string[];
    completed: boolean;
    appointment?: {
        id: string;
        date: string;
        time: string;
        serviceName?: string;
        specialistName?: string;
    };
}
export declare class BotService {
    private readonly servicesService;
    private readonly specialistsService;
    private readonly availabilityService;
    private readonly appointmentsService;
    private readonly monthMap;
    private readonly serviceAliases;
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
    processBookingTurn(message: string, incomingState?: Partial<BotBookingState>): Promise<BotBookingTurnResponse>;
    private initBookingState;
    private getMissingFields;
    private replyForCurrentStep;
    private replyWithServicesAndKeepStep;
    private resolveService;
    private resolveSpecialist;
    private extractEmail;
    private extractPhone;
    private extractName;
    private extractTime;
    private extractDate;
    private containsAny;
    private normalizeText;
    private startOfDay;
    private isValidDate;
    private buildDate;
    private toIsoDate;
}
