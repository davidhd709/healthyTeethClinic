'use client';

import { useState, type FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PROCEDURE_STATUSES,
  PROCEDURE_STATUS_LABELS,
  STATUS_CATALOG,
  TOOTH_STATUSES,
  type ProcedureStatus,
  type ToothStatus,
} from '@/lib/odontogram/status-catalog';
import type { IToothSurfaceRecord } from '@/types/odontogram';
import type { ISpecialist } from '@/types';

const STATUS_NONE_VALUE = '__none__';
const SPECIALIST_NONE_VALUE = '__none__';

export interface SurfaceFormValues {
  condition: ToothStatus | '';
  treatment: string;
  status: ProcedureStatus;
  notes: string;
  date: string;
  specialistId: string;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isoDate(value?: string) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function initialFromRecord(record: IToothSurfaceRecord | undefined): SurfaceFormValues {
  return {
    condition: record?.condition ?? '',
    treatment: record?.treatment ?? '',
    status: record?.status ?? 'none',
    notes: record?.notes ?? '',
    date: isoDate(record?.date) || todayISO(),
    specialistId:
      typeof record?.specialistId === 'string'
        ? record.specialistId
        : record?.specialistId?._id ?? '',
  };
}

interface ToothTreatmentFormProps {
  record: IToothSurfaceRecord | undefined;
  specialists: ISpecialist[];
  submitting: boolean;
  disabled?: boolean;
  onSubmit: (values: SurfaceFormValues) => Promise<void> | void;
}

export default function ToothTreatmentForm({
  record,
  specialists,
  submitting,
  disabled,
  onSubmit,
}: ToothTreatmentFormProps) {
  const [values, setValues] = useState<SurfaceFormValues>(() => initialFromRecord(record));

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sf-condition">Condición clínica</Label>
          <Select
            value={values.condition || STATUS_NONE_VALUE}
            onValueChange={(v) =>
              setValues({ ...values, condition: v === STATUS_NONE_VALUE ? '' : (v as ToothStatus) })
            }
            disabled={disabled}
          >
            <SelectTrigger id="sf-condition">
              <SelectValue placeholder="— Sin registrar —" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value={STATUS_NONE_VALUE}>— Sin registrar —</SelectItem>
              {TOOTH_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                      style={{ backgroundColor: STATUS_CATALOG[s].color }}
                    />
                    {STATUS_CATALOG[s].label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sf-status">Estado del procedimiento</Label>
          <Select
            value={values.status}
            onValueChange={(v: ProcedureStatus) => setValues({ ...values, status: v })}
            disabled={disabled}
          >
            <SelectTrigger id="sf-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROCEDURE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {PROCEDURE_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="sf-treatment">Tratamiento</Label>
          <Input
            id="sf-treatment"
            value={values.treatment}
            onChange={(e) => setValues({ ...values, treatment: e.target.value })}
            placeholder="Ej. Resina clase II, endodoncia unirradicular…"
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sf-date">Fecha</Label>
          <Input
            id="sf-date"
            type="date"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="sf-specialist">Especialista</Label>
          <Select
            value={values.specialistId || SPECIALIST_NONE_VALUE}
            onValueChange={(v) =>
              setValues({ ...values, specialistId: v === SPECIALIST_NONE_VALUE ? '' : v })
            }
            disabled={disabled}
          >
            <SelectTrigger id="sf-specialist">
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
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="sf-notes">Observaciones</Label>
          <Textarea
            id="sf-notes"
            rows={3}
            value={values.notes}
            onChange={(e) => setValues({ ...values, notes: e.target.value })}
            disabled={disabled}
          />
        </div>
      </div>

      {!disabled && (
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
