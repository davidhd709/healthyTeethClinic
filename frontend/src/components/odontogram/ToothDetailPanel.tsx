'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IToothRecord, IOdontogramHistoryEntry } from '@/types/odontogram';
import type { ISpecialist } from '@/types';
import {
  STATUS_CATALOG,
  TOOTH_STATUSES,
  SURFACE_NAMES,
  type SurfaceName,
  type ToothStatus,
} from '@/lib/odontogram/status-catalog';
import {
  occlusalLabel,
  QUADRANT_LABELS,
  TOOTH_TYPE_LABELS,
} from '@/lib/odontogram/fdi-teeth';
import ToothTreatmentForm, { type SurfaceFormValues } from './ToothTreatmentForm';
import ToothHistoryTable from './ToothHistoryTable';

function surfaceDisplayLabel(surface: SurfaceName, toothType: IToothRecord['toothType']): string {
  switch (surface) {
    case 'vestibular':
      return 'Vestibular';
    case 'lingual_palatal':
      return 'Lingual / palatina';
    case 'mesial':
      return 'Mesial';
    case 'distal':
      return 'Distal';
    case 'occlusal_incisal':
      return occlusalLabel(toothType);
  }
}

interface ToothDetailPanelProps {
  open: boolean;
  patientId: string;
  tooth: IToothRecord | null;
  initialSurface?: SurfaceName | null;
  specialists: ISpecialist[];
  canEdit: boolean;
  onClose: () => void;
  onSaved: (updatedTooth: IToothRecord) => void;
}

function jsonHeaders() {
  return {
    ...authHeaders(),
    'Content-Type': 'application/json',
  };
}

export default function ToothDetailPanel({
  open,
  patientId,
  tooth,
  initialSurface,
  specialists,
  canEdit,
  onClose,
  onSaved,
}: ToothDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<string>('surfaces');
  const [activeSurface, setActiveSurface] = useState<SurfaceName>('occlusal_incisal');
  const [savingSurface, setSavingSurface] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [history, setHistory] = useState<IOdontogramHistoryEntry[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (open && initialSurface) {
      setActiveSurface(initialSurface);
      setActiveTab('surfaces');
    } else if (open && !initialSurface) {
      setActiveTab('status');
    }
  }, [open, initialSurface]);

  const loadHistory = useCallback(async () => {
    if (!tooth) return;
    setHistoryLoading(true);
    try {
      const params = new URLSearchParams({ toothNumber: tooth.toothNumber });
      const res = await fetch(
        apiUrl(`/api/patients/${patientId}/odontogram/history?${params.toString()}`),
        { headers: authHeaders() },
      );
      if (!res.ok) throw new Error();
      setHistory((await res.json()) as IOdontogramHistoryEntry[]);
    } catch {
      toast.error('No se pudo cargar el historial del diente');
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [patientId, tooth]);

  useEffect(() => {
    if (open && activeTab === 'history') {
      loadHistory();
    }
  }, [open, activeTab, loadHistory]);

  if (!tooth) return null;

  async function handleSurfaceSubmit(values: SurfaceFormValues) {
    if (!tooth) return;
    setSavingSurface(true);
    try {
      const payload = {
        condition: values.condition || undefined,
        treatment: values.treatment || undefined,
        status: values.status,
        notes: values.notes || undefined,
        date: values.date ? new Date(values.date).toISOString() : undefined,
        specialistId: values.specialistId || undefined,
      };
      const res = await fetch(
        apiUrl(
          `/api/patients/${patientId}/odontogram/teeth/${tooth.toothNumber}/surfaces/${activeSurface}`,
        ),
        {
          method: 'PATCH',
          headers: jsonHeaders(),
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? 'Error al guardar');
      }
      const updatedOdontogram = await res.json();
      const updatedTooth = updatedOdontogram.teeth?.find(
        (t: IToothRecord) => t.toothNumber === tooth.toothNumber,
      );
      if (updatedTooth) onSaved(updatedTooth);
      toast.success('Superficie actualizada');
      if (activeTab === 'history') loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSavingSurface(false);
    }
  }

  async function handleToothStatusSubmit(statuses: ToothStatus[], notes: string) {
    if (!tooth) return;
    setSavingStatus(true);
    try {
      const res = await fetch(
        apiUrl(`/api/patients/${patientId}/odontogram/teeth/${tooth.toothNumber}`),
        {
          method: 'PATCH',
          headers: jsonHeaders(),
          body: JSON.stringify({
            status: statuses.length > 0 ? statuses : ['healthy'],
            notes: notes || undefined,
          }),
        },
      );
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message ?? 'Error al guardar');
      }
      const updatedOdontogram = await res.json();
      const updatedTooth = updatedOdontogram.teeth?.find(
        (t: IToothRecord) => t.toothNumber === tooth.toothNumber,
      );
      if (updatedTooth) onSaved(updatedTooth);
      toast.success('Estados del diente actualizados');
      if (activeTab === 'history') loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSavingStatus(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="space-y-2 border-b p-6">
          <SheetTitle className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900">#{tooth.toothNumber}</span>
            <span className="text-base font-medium text-slate-600">
              {TOOTH_TYPE_LABELS[tooth.toothType]} · {QUADRANT_LABELS[tooth.quadrant]}
            </span>
          </SheetTitle>
          <SheetDescription>
            <div className="flex flex-wrap gap-1.5">
              {tooth.status.map((s) => {
                const meta = STATUS_CATALOG[s];
                return (
                  <span
                    key={s}
                    className="rounded-full px-2 py-0.5 text-xs"
                    style={{ backgroundColor: meta.color, color: meta.textColor }}
                  >
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </SheetDescription>
        </SheetHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="bg-slate-100">
            <TabsTrigger value="surfaces">Superficies</TabsTrigger>
            <TabsTrigger value="status">Estado del diente</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="surfaces" className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-1.5">
              {SURFACE_NAMES.map((s) => {
                const record = tooth.surfaces?.[s];
                const hasData = record?.condition || record?.status !== 'none';
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setActiveSurface(s)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
                      activeSurface === s
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-900'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                      style={{
                        backgroundColor: record?.condition
                          ? STATUS_CATALOG[record.condition].color
                          : '#ffffff',
                      }}
                    />
                    {surfaceDisplayLabel(s, tooth.toothType)}
                    {hasData && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />}
                  </button>
                );
              })}
            </div>

            <Separator />

            <ToothTreatmentForm
              key={`${tooth.toothNumber}-${activeSurface}`}
              record={tooth.surfaces?.[activeSurface]}
              specialists={specialists}
              submitting={savingSurface}
              disabled={!canEdit}
              onSubmit={handleSurfaceSubmit}
            />
          </TabsContent>

          <TabsContent value="status" className="mt-5">
            <ToothStatusEditor
              currentStatus={tooth.status}
              currentNotes={tooth.notes}
              disabled={!canEdit}
              saving={savingStatus}
              onSave={handleToothStatusSubmit}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-5">
            {historyLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ToothHistoryTable entries={history ?? []} />
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function ToothStatusEditor({
  currentStatus,
  currentNotes,
  disabled,
  saving,
  onSave,
}: {
  currentStatus: ToothStatus[];
  currentNotes?: string;
  disabled: boolean;
  saving: boolean;
  onSave: (statuses: ToothStatus[], notes: string) => void;
}) {
  const [statuses, setStatuses] = useState<ToothStatus[]>(currentStatus);
  const [notes, setNotes] = useState<string>(currentNotes ?? '');

  function toggle(status: ToothStatus) {
    setStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs uppercase tracking-wide text-slate-500">
          Estados clínicos aplicables
        </Label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOOTH_STATUSES.map((s) => {
            const meta = STATUS_CATALOG[s];
            const active = statuses.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => !disabled && toggle(s)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs transition-colors ${
                  active
                    ? 'border-slate-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-400'
                } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
                style={active ? { backgroundColor: meta.color, color: meta.textColor } : undefined}
                title={meta.description}
              >
                {!active && (
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                    style={{ backgroundColor: meta.color }}
                  />
                )}
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label htmlFor="tooth-notes" className="text-xs uppercase tracking-wide text-slate-500">
          Notas del diente
        </Label>
        <textarea
          id="tooth-notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={disabled}
          className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>

      {!disabled && (
        <div className="flex justify-end">
          <Button onClick={() => onSave(statuses, notes)} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              'Guardar estado general'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
