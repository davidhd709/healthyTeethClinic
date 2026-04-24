import { ProcedureStatus, ToothStatus } from '../constants/tooth-status.constant';
export declare class UpdateSurfaceDto {
    condition?: ToothStatus;
    treatment?: string;
    status?: ProcedureStatus;
    notes?: string;
    date?: string;
    specialistId?: string;
}
