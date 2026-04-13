import { BotService } from './bot.service';
import { CreateAppointmentDto } from '../appointments/dto/create-appointment.dto';
export declare class BotController {
    private readonly botService;
    constructor(botService: BotService);
    getServices(format?: string): Promise<{
        text: string;
        services?: undefined;
    } | {
        services: import("./bot.service").BotServiceDto[];
        text?: undefined;
    }>;
    getSpecialists(serviceId?: string, format?: string): Promise<{
        text: string;
        specialists?: undefined;
    } | {
        specialists: import("./bot.service").BotSpecialistDto[];
        text?: undefined;
    }>;
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
}
