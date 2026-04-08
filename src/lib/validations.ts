import { z } from 'zod';

export const appointmentSchema = z.object({
  patientName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  patientEmail: z.string().email('Ingrese un correo electrónico válido'),
  patientPhone: z.string().min(7, 'Ingrese un número de teléfono válido'),
  patientDocument: z.string().optional(),
  serviceId: z.string().min(1, 'Seleccione un servicio'),
  specialistId: z.string().min(1, 'Seleccione un especialista'),
  date: z.string().min(1, 'Seleccione una fecha'),
  time: z.string().min(1, 'Seleccione un horario'),
  reasonForVisit: z.string().min(10, 'Describa brevemente el motivo de su consulta (mín. 10 caracteres)'),
  dataConsent: z.boolean().refine((val) => val === true, 'Debe aceptar el tratamiento de datos personales'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const contactSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Ingrese un correo electrónico válido'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Ingrese un asunto'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const serviceSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  durationMinutes: z.number().min(15, 'La duración mínima es 15 minutos'),
  basePrice: z.number().optional(),
  icon: z.string().min(1, 'Seleccione un icono'),
  isActive: z.boolean(),
});

export const specialistSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres'),
  photo: z.string().min(1, 'Ingrese la URL de la foto'),
  specialty: z.string().min(3, 'Ingrese la especialidad'),
  subspecialty: z.string().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  experience: z.number().min(1, 'Ingrese los años de experiencia'),
  isActive: z.boolean(),
});
