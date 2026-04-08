export declare class BreakDto {
    start: string;
    end: string;
}
export declare class WeeklyScheduleDto {
    day: string;
    startTime: string;
    endTime: string;
    blockDuration: number;
    breaks?: BreakDto[];
}
export declare class CreateSpecialistDto {
    name: string;
    slug?: string;
    photo?: string;
    specialty: string;
    subspecialty?: string;
    description: string;
    experience: number;
    services?: string[];
    weeklySchedule?: WeeklyScheduleDto[];
    isActive?: boolean;
}
