import { z } from 'zod';

export const medicalHistoryMainSchema = z.object({
  chiefComplaint: z.string().trim().optional().or(z.literal('')),
  initialDiagnosis: z.string().trim().optional().or(z.literal('')),
  treatmentPlan: z.string().trim().optional().or(z.literal('')),
  generalObservations: z.string().trim().optional().or(z.literal('')),
});

export type MedicalHistoryMainInput = z.input<typeof medicalHistoryMainSchema>;
export type MedicalHistoryMainValues = z.output<typeof medicalHistoryMainSchema>;

export const clinicalEvolutionSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .refine((value) => {
      const date = new Date(value);
      return !Number.isNaN(date.getTime());
    }, 'Fecha inválida'),
  specialistId: z.string().optional().or(z.literal('')),
  description: z.string().min(10, 'Describe con más detalle (mínimo 10 caracteres)').trim(),
  diagnosis: z.string().trim().optional().or(z.literal('')),
  treatment: z.string().trim().optional().or(z.literal('')),
  recommendations: z.string().trim().optional().or(z.literal('')),
  nextAppointmentSuggestion: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
});

export type ClinicalEvolutionInput = z.input<typeof clinicalEvolutionSchema>;
export type ClinicalEvolutionValues = z.output<typeof clinicalEvolutionSchema>;
