import { Model } from 'mongoose';
import { ServiceDocument } from '../services/schemas/service.schema';
import { SpecialistDocument } from '../specialists/schemas/specialist.schema';
import { AppointmentDocument } from '../appointments/schemas/appointment.schema';
import { ContactDocument } from '../contact/schemas/contact.schema';
export declare class SeedService {
    private readonly serviceModel;
    private readonly specialistModel;
    private readonly appointmentModel;
    private readonly contactModel;
    constructor(serviceModel: Model<ServiceDocument>, specialistModel: Model<SpecialistDocument>, appointmentModel: Model<AppointmentDocument>, contactModel: Model<ContactDocument>);
    seed(): Promise<{
        message: string;
        services: number;
        specialists: number;
    }>;
}
