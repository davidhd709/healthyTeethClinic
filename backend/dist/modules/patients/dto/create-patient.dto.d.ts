import type { DocumentType, PatientSex } from '../schemas/patient.schema';
export declare class EmergencyContactDto {
    name: string;
    phone: string;
    relationship?: string;
}
export declare class MedicalInfoDto {
    allergies?: string[];
    diseases?: string[];
    medications?: string[];
    medicalHistory?: string;
    dentalHistory?: string;
}
export declare class CreatePatientDto {
    documentType: DocumentType;
    documentNumber: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    sex: PatientSex;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
    insuranceProvider?: string;
    emergencyContact?: EmergencyContactDto;
    medicalInfo?: MedicalInfoDto;
    observations?: string;
    isActive?: boolean;
}
