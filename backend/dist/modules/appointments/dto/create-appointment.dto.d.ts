export declare class CreateAppointmentDto {
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    patientDocument?: string;
    serviceId: string;
    specialistId: string;
    date: string;
    time: string;
    reasonForVisit: string;
    dataConsent: boolean;
}
