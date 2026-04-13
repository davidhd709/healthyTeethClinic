import { ConfigService } from '@nestjs/config';
export interface CalendarEventData {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    serviceName: string;
    serviceDurationMinutes: number;
    specialistName: string;
    date: string;
    time: string;
    reasonForVisit: string;
}
export declare class GoogleCalendarService {
    private config;
    private readonly logger;
    private calendar;
    private calendarId;
    constructor(config: ConfigService);
    private initCalendar;
    createAppointmentEvent(data: CalendarEventData): Promise<string | null>;
    private buildIsoDate;
    private addMinutesToIso;
}
