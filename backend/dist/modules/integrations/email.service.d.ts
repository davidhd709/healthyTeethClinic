import { ConfigService } from '@nestjs/config';
export interface AppointmentEmailData {
    patientName: string;
    patientEmail: string;
    serviceName: string;
    specialistName: string;
    date: string;
    time: string;
    clinicAddress?: string;
    clinicPhone?: string;
}
export declare class EmailService {
    private config;
    private readonly logger;
    private transporter;
    constructor(config: ConfigService);
    private initTransporter;
    sendAppointmentConfirmation(data: AppointmentEmailData): Promise<void>;
    private buildConfirmationHtml;
}
