import type { IPatient, PatientSex, DocumentType } from '@/types';

export function calculateAge(birthDate: string | Date | undefined | null): number | null {
  if (!birthDate) return null;
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  if (age < 0 || age > 130) return null;
  return age;
}

export function fullName(patient: Pick<IPatient, 'firstName' | 'lastName'>): string {
  return `${patient.firstName} ${patient.lastName}`.trim();
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  CC: 'Cédula de ciudadanía',
  TI: 'Tarjeta de identidad',
  CE: 'Cédula de extranjería',
  PP: 'Pasaporte',
  RC: 'Registro civil',
  otro: 'Otro',
};

export const SEX_LABELS: Record<PatientSex, string> = {
  M: 'Masculino',
  F: 'Femenino',
  O: 'Otro / Prefiere no decir',
};

export function initials(patient: Pick<IPatient, 'firstName' | 'lastName'>): string {
  const first = patient.firstName?.[0] ?? '';
  const last = patient.lastName?.[0] ?? '';
  return (first + last).toUpperCase() || '?';
}

export function formatBirthDateInput(value: string | Date | undefined | null): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}
