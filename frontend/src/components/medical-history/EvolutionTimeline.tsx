'use client';

import { CalendarDays, Pencil, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IClinicalEvolution } from '@/types';

interface EvolutionTimelineProps {
  evolutions: IClinicalEvolution[];
  canEdit: boolean;
  onEdit: (evolution: IClinicalEvolution) => void;
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString('es-CO', { dateStyle: 'medium' });
  } catch {
    return value;
  }
}

export default function EvolutionTimeline({
  evolutions,
  canEdit,
  onEdit,
}: EvolutionTimelineProps) {
  if (!evolutions || evolutions.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-slate-500">
          Aún no hay evoluciones registradas.
        </CardContent>
      </Card>
    );
  }

  const ordered = [...evolutions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <ol className="space-y-4">
      {ordered.map((ev) => {
        const specialist = typeof ev.specialistId === 'object' ? ev.specialistId : null;
        return (
          <li key={ev._id} className="relative pl-6">
            <span className="absolute left-2 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan-500" />
            <span
              className="absolute left-2 top-4 h-full w-px -translate-x-1/2 bg-slate-200"
              aria-hidden
            />
            <Card>
              <CardContent className="space-y-3 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{formatDate(ev.date)}</span>
                    {specialist && (
                      <Badge variant="secondary" className="gap-1 bg-cyan-50 text-cyan-700">
                        <UserCog className="h-3 w-3" />
                        {specialist.name}
                      </Badge>
                    )}
                  </div>
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(ev)}
                      className="h-8"
                    >
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      Editar
                    </Button>
                  )}
                </div>

                <p className="whitespace-pre-wrap text-sm text-slate-800">{ev.description}</p>

                <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <Field label="Diagnóstico" value={ev.diagnosis} />
                  <Field label="Tratamiento realizado" value={ev.treatment} />
                  <Field label="Recomendaciones" value={ev.recommendations} />
                  <Field
                    label="Próxima cita sugerida"
                    value={ev.nextAppointmentSuggestion ? formatDate(ev.nextAppointmentSuggestion) : undefined}
                  />
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ol>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="whitespace-pre-wrap text-slate-800">{value}</p>
    </div>
  );
}
