import { ConfigService } from '@nestjs/config';
export interface SheetAppointmentRow {
    createdAt: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientDocument?: string;
    serviceName: string;
    specialistName: string;
    date: string;
    time: string;
    status: string;
    reasonForVisit: string;
}
export declare class GoogleSheetsService {
    private config;
    private readonly logger;
    private sheets;
    private spreadsheetId;
    private sheetRange;
    constructor(config: ConfigService);
    private initSheets;
    appendAppointment(row: SheetAppointmentRow): Promise<void>;
}
