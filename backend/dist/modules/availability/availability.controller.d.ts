import { AvailabilityService } from './availability.service';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailability(specialistId: string, date: string): Promise<{
        specialist: string;
        date: string;
        slots: import("./availability.service").TimeSlot[];
    }>;
}
