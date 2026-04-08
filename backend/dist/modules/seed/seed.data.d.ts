export declare const servicesData: {
    name: string;
    slug: string;
    description: string;
    durationMinutes: number;
    basePrice: number;
    icon: string;
}[];
export declare const specialistsData: ({
    name: string;
    slug: string;
    photo: string;
    specialty: string;
    subspecialty: string;
    description: string;
    experience: number;
    servicesSlugs: string[];
    weeklySchedule: {
        day: string;
        startTime: string;
        endTime: string;
        blockDuration: number;
        breaks: {
            start: string;
            end: string;
        }[];
    }[];
} | {
    name: string;
    slug: string;
    photo: string;
    specialty: string;
    description: string;
    experience: number;
    servicesSlugs: string[];
    weeklySchedule: {
        day: string;
        startTime: string;
        endTime: string;
        blockDuration: number;
        breaks: {
            start: string;
            end: string;
        }[];
    }[];
    subspecialty?: undefined;
})[];
