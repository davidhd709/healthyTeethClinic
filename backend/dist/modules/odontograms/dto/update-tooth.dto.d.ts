import { ToothStatus } from '../constants/tooth-status.constant';
export declare class UpdateToothDto {
    status?: ToothStatus[];
    diagnosis?: string[];
    notes?: string;
    specialistId?: string;
}
