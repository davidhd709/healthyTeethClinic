'use client';

import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { STATUS_CATALOG } from '@/lib/odontogram/status-catalog';
import type { IOdontogramHistoryEntry } from '@/types/odontogram';
import type { ToothStatus } from '@/lib/odontogram/status-catalog';

const SURFACE_LABELS: Record<string, string> = {
  vestibular: 'Vestibular',
  lingual_palatal: 'Lingual/palatina',
  mesial: 'Mesial',
  distal: 'Distal',
  occlusal_incisal: 'Oclusal/incisal',
};

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString('es-CO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}

function StatusBadgeList({ statuses }: { statuses: ToothStatus[] }) {
  if (!statuses || statuses.length === 0) {
    return <span className="text-xs text-slate-400">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {statuses.map((s) => {
        const meta = STATUS_CATALOG[s];
        return (
          <span
            key={s}
            className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs"
            style={{ backgroundColor: meta.color, color: meta.textColor }}
          >
            {meta.label}
          </span>
        );
      })}
    </div>
  );
}

interface ToothHistoryTableProps {
  entries: IOdontogramHistoryEntry[];
}

export default function ToothHistoryTable({ entries }: ToothHistoryTableProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-8 text-center text-sm text-slate-500">
        Sin cambios registrados para este diente.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Superficie</TableHead>
            <TableHead>Anterior</TableHead>
            <TableHead>Nuevo</TableHead>
            <TableHead>Notas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((e) => {
            const specialist = typeof e.specialistId === 'object' ? e.specialistId : null;
            return (
              <TableRow key={e._id}>
                <TableCell className="align-top">
                  <div className="flex flex-col text-xs">
                    <span>{formatDateTime(e.createdAt)}</span>
                    {specialist && (
                      <span className="text-slate-500">{specialist.name}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  {e.surface ? (
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                      {SURFACE_LABELS[e.surface] ?? e.surface}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-500">General</span>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  <StatusBadgeList statuses={e.previousStatus} />
                </TableCell>
                <TableCell className="align-top">
                  <StatusBadgeList statuses={e.newStatus} />
                </TableCell>
                <TableCell className="align-top">
                  <span className="text-xs text-slate-700">
                    {e.notes ?? e.procedure ?? '—'}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
