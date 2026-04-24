'use client';

import { useState, type KeyboardEvent } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  patientFormSchema,
  type PatientFormInput,
  type PatientFormValues,
  DOCUMENT_TYPES,
  PATIENT_SEXES,
} from '@/lib/validations/patient.schema';
import { DOCUMENT_TYPE_LABELS, SEX_LABELS, formatBirthDateInput } from '@/lib/patient-utils';
import type { IPatient } from '@/types';

const defaultValues: PatientFormInput = {
  documentType: 'CC',
  documentNumber: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  sex: 'M',
  phone: '',
  email: '',
  address: '',
  city: '',
  insuranceProvider: '',
  emergencyContact: { name: '', phone: '', relationship: '' },
  medicalInfo: {
    allergies: [],
    diseases: [],
    medications: [],
    medicalHistory: '',
    dentalHistory: '',
  },
  observations: '',
  isActive: true,
};

function fromPatient(patient: IPatient): PatientFormInput {
  return {
    documentType: patient.documentType,
    documentNumber: patient.documentNumber,
    firstName: patient.firstName,
    lastName: patient.lastName,
    birthDate: formatBirthDateInput(patient.birthDate),
    sex: patient.sex,
    phone: patient.phone,
    email: patient.email ?? '',
    address: patient.address ?? '',
    city: patient.city ?? '',
    insuranceProvider: patient.insuranceProvider ?? '',
    emergencyContact: patient.emergencyContact
      ? {
          name: patient.emergencyContact.name ?? '',
          phone: patient.emergencyContact.phone ?? '',
          relationship: patient.emergencyContact.relationship ?? '',
        }
      : { name: '', phone: '', relationship: '' },
    medicalInfo: {
      allergies: patient.medicalInfo?.allergies ?? [],
      diseases: patient.medicalInfo?.diseases ?? [],
      medications: patient.medicalInfo?.medications ?? [],
      medicalHistory: patient.medicalInfo?.medicalHistory ?? '',
      dentalHistory: patient.medicalInfo?.dentalHistory ?? '',
    },
    observations: patient.observations ?? '',
    isActive: patient.isActive,
  };
}

interface PatientFormProps {
  initialPatient?: IPatient | null;
  submitting: boolean;
  onSubmit: (values: PatientFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function PatientForm({
  initialPatient,
  submitting,
  onSubmit,
  onCancel,
  submitLabel,
}: PatientFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PatientFormInput, unknown, PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: initialPatient ? fromPatient(initialPatient) : defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Identificación</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="documentType">Tipo de documento</Label>
            <Controller
              control={control}
              name="documentType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="documentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {DOCUMENT_TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="documentNumber">Número de documento</Label>
            <Input id="documentNumber" {...register('documentNumber')} />
            <FieldError message={errors.documentNumber?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="birthDate">Fecha de nacimiento</Label>
            <Input id="birthDate" type="date" {...register('birthDate')} />
            <FieldError message={errors.birthDate?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="firstName">Nombres</Label>
            <Input id="firstName" {...register('firstName')} />
            <FieldError message={errors.firstName?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Apellidos</Label>
            <Input id="lastName" {...register('lastName')} />
            <FieldError message={errors.lastName?.message} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sex">Sexo</Label>
            <Controller
              control={control}
              name="sex"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PATIENT_SEXES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SEX_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Contacto</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register('phone')} />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Correo (opcional)</Label>
            <Input id="email" type="email" {...register('email')} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" {...register('address')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city">Ciudad</Label>
            <Input id="city" {...register('city')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="insuranceProvider">EPS o aseguradora</Label>
            <Input id="insuranceProvider" {...register('insuranceProvider')} />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Contacto de emergencia</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="ec-name">Nombre</Label>
            <Input id="ec-name" {...register('emergencyContact.name')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ec-phone">Teléfono</Label>
            <Input id="ec-phone" {...register('emergencyContact.phone')} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ec-relationship">Parentesco</Label>
            <Input id="ec-relationship" {...register('emergencyContact.relationship')} />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Antecedentes médicos</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            control={control}
            name="medicalInfo.allergies"
            render={({ field }) => (
              <TagInput
                id="allergies"
                label="Alergias"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Ej. Penicilina, latex…"
              />
            )}
          />
          <Controller
            control={control}
            name="medicalInfo.diseases"
            render={({ field }) => (
              <TagInput
                id="diseases"
                label="Enfermedades relevantes"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Ej. Hipertensión…"
              />
            )}
          />
          <Controller
            control={control}
            name="medicalInfo.medications"
            render={({ field }) => (
              <TagInput
                id="medications"
                label="Medicamentos actuales"
                value={field.value ?? []}
                onChange={field.onChange}
                placeholder="Ej. Losartán 50mg…"
              />
            )}
          />
          <div className="space-y-1.5 md:col-span-3">
            <Label htmlFor="medicalHistory">Antecedentes médicos generales</Label>
            <Textarea
              id="medicalHistory"
              rows={3}
              {...register('medicalInfo.medicalHistory')}
            />
          </div>
          <div className="space-y-1.5 md:col-span-3">
            <Label htmlFor="dentalHistory">Antecedentes odontológicos</Label>
            <Textarea
              id="dentalHistory"
              rows={3}
              {...register('medicalInfo.dentalHistory')}
            />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Otros</h2>
        <div className="space-y-1.5">
          <Label htmlFor="observations">Observaciones generales</Label>
          <Textarea id="observations" rows={3} {...register('observations')} />
        </div>
        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Paciente activo
          </Label>
        </div>
      </section>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            submitLabel ?? (initialPatient ? 'Guardar cambios' : 'Crear paciente')
          )}
        </Button>
      </div>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-600">{message}</p>;
}

interface TagInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function TagInput({ id, label, value, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((tag, idx) => (
            <Badge
              key={`${tag}-${idx}`}
              variant="secondary"
              className="cursor-default gap-1 bg-slate-100 text-slate-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== idx))}
                className="rounded-full p-0.5 hover:bg-slate-300"
                aria-label={`Eliminar ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
