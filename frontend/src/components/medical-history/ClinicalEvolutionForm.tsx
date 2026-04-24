'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  clinicalEvolutionSchema,
  type ClinicalEvolutionInput,
  type ClinicalEvolutionValues,
} from '@/lib/validations/medical-history.schema';
import type { IClinicalEvolution, ISpecialist } from '@/types';

interface ClinicalEvolutionFormProps {
  initial?: IClinicalEvolution | null;
  specialists: ISpecialist[];
  submitting: boolean;
  submitLabel?: string;
  onSubmit: (values: ClinicalEvolutionValues) => Promise<void> | void;
  onCancel?: () => void;
}

const SPECIALIST_NONE_VALUE = '__none__';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function isoDateOnly(value?: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function deriveInitial(evolution?: IClinicalEvolution | null): ClinicalEvolutionInput {
  if (!evolution) {
    return {
      date: todayISO(),
      specialistId: '',
      description: '',
      diagnosis: '',
      treatment: '',
      recommendations: '',
      nextAppointmentSuggestion: '',
    };
  }
  const specialistId =
    typeof evolution.specialistId === 'string'
      ? evolution.specialistId
      : evolution.specialistId?._id ?? '';
  return {
    date: isoDateOnly(evolution.date) || todayISO(),
    specialistId,
    description: evolution.description,
    diagnosis: evolution.diagnosis ?? '',
    treatment: evolution.treatment ?? '',
    recommendations: evolution.recommendations ?? '',
    nextAppointmentSuggestion: isoDateOnly(evolution.nextAppointmentSuggestion),
  };
}

export default function ClinicalEvolutionForm({
  initial,
  specialists,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: ClinicalEvolutionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClinicalEvolutionInput, unknown, ClinicalEvolutionValues>({
    resolver: zodResolver(clinicalEvolutionSchema),
    defaultValues: deriveInitial(initial),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ev-date">Fecha</Label>
          <Input id="ev-date" type="date" {...register('date')} />
          <FieldError message={errors.date?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ev-specialist">Especialista</Label>
          <Controller
            control={control}
            name="specialistId"
            render={({ field }) => (
              <Select
                value={field.value && field.value.length > 0 ? field.value : SPECIALIST_NONE_VALUE}
                onValueChange={(v) => field.onChange(v === SPECIALIST_NONE_VALUE ? '' : v)}
              >
                <SelectTrigger id="ev-specialist">
                  <SelectValue placeholder="— Sin especialista —" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SPECIALIST_NONE_VALUE}>— Sin especialista —</SelectItem>
                  {specialists.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name} — {s.specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ev-description">Descripción clínica</Label>
        <Textarea
          id="ev-description"
          rows={4}
          {...register('description')}
          placeholder="¿Qué se observó y qué se hizo en esta sesión?"
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="ev-diagnosis">Diagnóstico</Label>
          <Textarea id="ev-diagnosis" rows={2} {...register('diagnosis')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ev-treatment">Tratamiento realizado</Label>
          <Textarea id="ev-treatment" rows={2} {...register('treatment')} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ev-recommendations">Recomendaciones</Label>
        <Textarea id="ev-recommendations" rows={2} {...register('recommendations')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ev-next">Próxima cita sugerida (opcional)</Label>
        <Input id="ev-next" type="date" {...register('nextAppointmentSuggestion')} />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando…
            </>
          ) : (
            submitLabel ?? (initial ? 'Guardar cambios' : 'Agregar evolución')
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
