import { z } from 'zod';

export const DOCUMENT_TYPES = ['CC', 'TI', 'CE', 'PP', 'RC', 'otro'] as const;
export const PATIENT_SEXES = ['M', 'F', 'O'] as const;

const emergencyContactSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto').trim(),
  phone: z.string().min(7, 'Teléfono inválido').trim(),
  relationship: z.string().trim().optional().or(z.literal('')),
});

const medicalInfoSchema = z.object({
  allergies: z.array(z.string().trim()).default([]),
  diseases: z.array(z.string().trim()).default([]),
  medications: z.array(z.string().trim()).default([]),
  medicalHistory: z.string().trim().optional().or(z.literal('')),
  dentalHistory: z.string().trim().optional().or(z.literal('')),
});

export const patientFormSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES),
  documentNumber: z.string().min(3, 'Número de documento inválido').trim(),
  firstName: z.string().min(2, 'Nombre demasiado corto').trim(),
  lastName: z.string().min(2, 'Apellido demasiado corto').trim(),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
    }, 'La fecha no puede ser futura'),
  sex: z.enum(PATIENT_SEXES),
  phone: z.string().min(7, 'Teléfono inválido').trim(),
  email: z
    .string()
    .email('Correo inválido')
    .optional()
    .or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  insuranceProvider: z.string().trim().optional().or(z.literal('')),
  emergencyContact: emergencyContactSchema.optional(),
  medicalInfo: medicalInfoSchema,
  observations: z.string().trim().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
});

export type PatientFormInput = z.input<typeof patientFormSchema>;
export type PatientFormValues = z.output<typeof patientFormSchema>;
