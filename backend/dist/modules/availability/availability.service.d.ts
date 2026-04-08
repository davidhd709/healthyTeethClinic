import { Model } from 'mongoose';
import { SpecialistDocument } from '../specialists/schemas/specialist.schema';
import { AppointmentDocument } from '../appointments/schemas/appointment.schema';
export interface TimeSlot {
    time: string;
    available: boolean;
}
export declare class AvailabilityService {
    private readonly specialistModel;
    private readonly appointmentModel;
    private readonly dayMap;
    constructor(specialistModel: Model<SpecialistDocument>, appointmentModel: Model<AppointmentDocument>);
    getAvailability(specialistId: string, date: string): Promise<{
        specialist: string;
        date: string;
        slots: TimeSlot[];
    }>;
    private generateTimeSlots;
    private timeToMinutes;
    private minutesToTime;
}
