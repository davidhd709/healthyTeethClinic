import { CreateAppointmentDto } from './create-appointment.dto';
declare const UpdateAppointmentDto_base: import("@nestjs/common").Type<Partial<CreateAppointmentDto>>;
export declare class UpdateAppointmentDto extends UpdateAppointmentDto_base {
    status?: string;
    internalNotes?: string;
}
export declare class UpdateStatusDto {
    status: string;
}
export {};
