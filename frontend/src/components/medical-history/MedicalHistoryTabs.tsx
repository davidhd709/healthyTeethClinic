'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IClinicalEvolution, IMedicalHistory, ISpecialist } from '@/types';
import { usePermissions } from '@/hooks/usePermissions';
import MedicalHistoryForm from './MedicalHistoryForm';
import EvolutionTimeline from './EvolutionTimeline';
import ClinicalEvolutionForm from './ClinicalEvolutionForm';
import type {
  ClinicalEvolutionValues,
  MedicalHistoryMainValues,
} from '@/lib/validations/medical-history.schema';

interface MedicalHistoryTabsProps {
  patientId: string;
}

function jsonHeaders() {
  return {
    ...authHeaders(),
    'Content-Type': 'application/json',
  };
}

function toEvolutionPayload(values: ClinicalEvolutionValues) {
  return {
    date: values.date ? new Date(values.date).toISOString() : undefined,
    specialistId: values.specialistId || undefined,
    description: values.description,
    diagnosis: values.diagnosis || undefined,
    treatment: values.treatment || undefined,
    recommendations: values.recommendations || undefined,
    nextAppointmentSuggestion: values.nextAppointmentSuggestion
      ? new Date(values.nextAppointmentSuggestion).toISOString()
      : undefined,
  };
}

export default function MedicalHistoryTabs({ patientId }: MedicalHistoryTabsProps) {
  const { can } = usePermissions();
  const canEdit = can('medicalHistory.edit');

  const [history, setHistory] = useState<IMedicalHistory | null>(null);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingMain, setSavingMain] = useState(false);
  const [savingEvolution, setSavingEvolution] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvolution, setEditingEvolution] = useState<IClinicalEvolution | null>(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/patients/${patientId}/medical-history`), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setHistory((await res.json()) as IMedicalHistory);
    } catch {
      toast.error('No se pudo cargar la historia clínica');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    async function loadSpecialists() {
      try {
        const res = await fetch(apiUrl('/api/specialists?active=all'), {
          headers: authHeaders(),
        });
        if (!res.ok) return;
        const data = (await res.json()) as ISpecialist[];
        setSpecialists(Array.isArray(data) ? data : []);
      } catch {
        /* silent */
      }
    }
    loadSpecialists();
  }, []);

  async function handleMainSubmit(values: MedicalHistoryMainValues) {
    setSavingMain(true);
    try {
      const payload = {
        chiefComplaint: values.chiefComplaint || undefined,
        initialDiagnosis: values.initialDiagnosis || undefined,
        treatmentPlan: values.treatmentPlan || undefined,
        generalObservations: values.generalObservations || undefined,
      };
      const res = await fetch(apiUrl(`/api/patients/${patientId}/medical-history`), {
        method: 'PATCH',
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? 'Error al guardar');
      }
      setHistory((await res.json()) as IMedicalHistory);
      toast.success('Historia clínica actualizada');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSavingMain(false);
    }
  }

  async function handleEvolutionSubmit(values: ClinicalEvolutionValues) {
    setSavingEvolution(true);
    try {
      const payload = toEvolutionPayload(values);
      const url = editingEvolution
        ? apiUrl(
            `/api/patients/${patientId}/medical-history/evolutions/${editingEvolution._id}`,
          )
        : apiUrl(`/api/patients/${patientId}/medical-history/evolutions`);
      const method = editingEvolution ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: jsonHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        const message = err?.message ?? 'Error al guardar la evolución';
        throw new Error(Array.isArray(message) ? message.join(', ') : message);
      }
      setHistory((await res.json()) as IMedicalHistory);
      toast.success(editingEvolution ? 'Evolución actualizada' : 'Evolución agregada');
      setDialogOpen(false);
      setEditingEvolution(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSavingEvolution(false);
    }
  }

  function openAddDialog() {
    setEditingEvolution(null);
    setDialogOpen(true);
  }

  function openEditDialog(evolution: IClinicalEvolution) {
    setEditingEvolution(evolution);
    setDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="main">Datos clínicos</TabsTrigger>
          <TabsTrigger value="evolutions">
            Evoluciones{history ? ` (${history.evolutions.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Motivo, diagnóstico y plan de tratamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MedicalHistoryForm
                history={history}
                readOnly={!canEdit}
                submitting={savingMain}
                onSubmit={handleMainSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolutions" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Registro cronológico de las atenciones clínicas del paciente.
            </p>
            {canEdit && (
              <Button onClick={openAddDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Nueva evolución
              </Button>
            )}
          </div>

          <EvolutionTimeline
            evolutions={history?.evolutions ?? []}
            canEdit={canEdit}
            onEdit={openEditDialog}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setEditingEvolution(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEvolution ? 'Editar evolución' : 'Nueva evolución clínica'}
            </DialogTitle>
            <DialogDescription>
              {editingEvolution
                ? 'Ajusta la información de esta evolución. Las evoluciones no se eliminan del historial.'
                : 'Registra los hallazgos y tratamientos de esta atención.'}
            </DialogDescription>
          </DialogHeader>
          <ClinicalEvolutionForm
            key={editingEvolution?._id ?? 'new'}
            initial={editingEvolution}
            specialists={specialists}
            submitting={savingEvolution}
            onSubmit={handleEvolutionSubmit}
            onCancel={() => {
              setDialogOpen(false);
              setEditingEvolution(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
