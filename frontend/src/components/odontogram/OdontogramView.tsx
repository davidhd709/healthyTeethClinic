'use client';

import { useCallback, useEffect, useState } from 'react';
import { Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiUrl, authHeaders } from '@/lib/api';
import type { IOdontogram, IToothRecord } from '@/types/odontogram';
import type { ISpecialist } from '@/types';
import type { SurfaceName } from '@/lib/odontogram/status-catalog';
import { LOWER_ARCH_ORDER, UPPER_ARCH_ORDER } from '@/lib/odontogram/fdi-teeth';
import { usePermissions } from '@/hooks/usePermissions';
import DentalArch from './DentalArch';
import OdontogramLegend from './OdontogramLegend';
import ToothDetailPanel from './ToothDetailPanel';

interface OdontogramViewProps {
  patientId: string;
}

export default function OdontogramView({ patientId }: OdontogramViewProps) {
  const { can } = usePermissions();
  const canEdit = can('odontogram.edit');

  const [odontogram, setOdontogram] = useState<IOdontogram | null>(null);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTooth, setSelectedTooth] = useState<IToothRecord | null>(null);
  const [selectedSurface, setSelectedSurface] = useState<SurfaceName | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const fetchOdontogram = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/patients/${patientId}/odontogram`), {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setOdontogram((await res.json()) as IOdontogram);
    } catch {
      toast.error('No se pudo cargar el odontograma');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchOdontogram();
  }, [fetchOdontogram]);

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

  function handleSelectTooth(
    tooth: IToothRecord,
    target: { type: 'tooth' } | { type: 'surface'; surface: SurfaceName },
  ) {
    setSelectedTooth(tooth);
    setSelectedSurface(target.type === 'surface' ? target.surface : null);
    setPanelOpen(true);
  }

  function handleSaved(updatedTooth: IToothRecord) {
    setOdontogram((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        teeth: prev.teeth.map((t) =>
          t.toothNumber === updatedTooth.toothNumber ? updatedTooth : t,
        ),
      };
    });
    setSelectedTooth(updatedTooth);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!odontogram) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-slate-500">
          No se pudo cargar el odontograma.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Stethoscope className="h-4 w-4 text-cyan-600" />
        <span>
          Haz clic en una <strong>superficie</strong> para marcar condición y tratamiento,
          o en <strong>Detalle</strong> para editar estados generales e historial.
        </span>
      </div>

      <Card>
        <CardContent className="space-y-6 py-6">
          <DentalArch
            label="Arcada superior"
            order={UPPER_ARCH_ORDER}
            teeth={odontogram.teeth}
            selectedToothNumber={selectedTooth?.toothNumber}
            onSelect={handleSelectTooth}
            disabled={!canEdit}
          />
          <DentalArch
            label="Arcada inferior"
            order={LOWER_ARCH_ORDER}
            teeth={odontogram.teeth}
            selectedToothNumber={selectedTooth?.toothNumber}
            onSelect={handleSelectTooth}
            disabled={!canEdit}
          />
        </CardContent>
      </Card>

      <OdontogramLegend />

      <ToothDetailPanel
        open={panelOpen}
        patientId={patientId}
        tooth={selectedTooth}
        initialSurface={selectedSurface}
        specialists={specialists}
        canEdit={canEdit}
        onClose={() => setPanelOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  );
}
