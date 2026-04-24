import type { UserRole } from '@/lib/jwt';

export type { UserRole };

export interface IUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  specialistId?: string | { _id: string; name: string; slug: string; specialty: string };
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'CC' | 'TI' | 'CE' | 'PP' | 'RC' | 'otro';
export type PatientSex = 'M' | 'F' | 'O';

export interface IEmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
}

export interface IMedicalInfo {
  allergies: string[];
  diseases: string[];
  medications: string[];
  medicalHistory?: string;
  dentalHistory?: string;
}

export interface IPatient {
  _id: string;
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
  emergencyContact?: IEmergencyContact;
  medicalInfo: IMedicalInfo;
  observations?: string;
  isActive: boolean;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedPatients {
  items: IPatient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IService {
  _id: string;
  name: string;
  slug: string;
  description: string;
  durationMinutes: number;
  basePrice?: number;
  icon: string;
  image?: string;
  specialists: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IWeeklySchedule {
  day: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';
  startTime: string;
  endTime: string;
  blockDuration: number;
  breaks?: { start: string; end: string }[];
}

export interface ISpecialist {
  _id: string;
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  subspecialty?: string;
  description: string;
  experience: number;
  services: Array<string | IService>;
  weeklySchedule: IWeeklySchedule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface IAppointment {
  _id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientDocument?: string;
  serviceId: string | IService;
  specialistId: string | ISpecialist;
  date: string;
  time: string;
  status: AppointmentStatus;
  reasonForVisit: string;
  internalNotes?: string;
  dataConsent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ITestimonial {
  id: string;
  name: string;
  treatment: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
