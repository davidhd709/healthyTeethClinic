'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  medicalHistoryMainSchema,
  type MedicalHistoryMainInput,
  type MedicalHistoryMainValues,
} from '@/lib/validations/medical-history.schema';
import type { IMedicalHistory } from '@/types';

interface MedicalHistoryFormProps {
  history: IMedicalHistory | null;
  readOnly?: boolean;
  submitting: boolean;
  onSubmit: (values: MedicalHistoryMainValues) => Promise<void> | void;
}

function deriveInitial(history: IMedicalHistory | null): MedicalHistoryMainInput {
  return {
    chiefComplaint: history?.chiefComplaint ?? '',
    initialDiagnosis: history?.initialDiagnosis ?? '',
    treatmentPlan: history?.treatmentPlan ?? '',
    generalObservations: history?.generalObservations ?? '',
  };
}

export default function MedicalHistoryForm({
  history,
  readOnly = false,
  submitting,
  onSubmit,
}: MedicalHistoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<MedicalHistoryMainInput, unknown, MedicalHistoryMainValues>({
    resolver: zodResolver(medicalHistoryMainSchema),
    defaultValues: deriveInitial(history),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="chiefComplaint">Motivo de consulta</Label>
        <Textarea
          id="chiefComplaint"
          rows={3}
          {...register('chiefComplaint')}
          disabled={readOnly}
          placeholder="¿Por qué consulta el paciente hoy?"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="initialDiagnosis">Diagnóstico inicial</Label>
        <Textarea
          id="initialDiagnosis"
          rows={3}
          {...register('initialDiagnosis')}
          disabled={readOnly}
          placeholder="Hallazgos y diagnóstico inicial"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="treatmentPlan">Plan de tratamiento</Label>
        <Textarea
          id="treatmentPlan"
          rows={4}
          {...register('treatmentPlan')}
          disabled={readOnly}
          placeholder="Fases y objetivos del plan"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="generalObservations">Observaciones clínicas generales</Label>
        <Textarea
          id="generalObservations"
          rows={3}
          {...register('generalObservations')}
          disabled={readOnly}
        />
      </div>

      {!readOnly && (
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting || !isDirty}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
