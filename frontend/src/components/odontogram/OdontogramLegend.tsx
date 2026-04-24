'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  GROUP_LABELS,
  STATUS_CATALOG,
  TOOTH_STATUSES,
  type StatusMeta,
  type ToothStatus,
} from '@/lib/odontogram/status-catalog';

const GROUPED = TOOTH_STATUSES.reduce<Record<StatusMeta['group'], ToothStatus[]>>(
  (acc, s) => {
    const group = STATUS_CATALOG[s].group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  },
  {} as Record<StatusMeta['group'], ToothStatus[]>,
);

export default function OdontogramLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Leyenda clínica</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(Object.keys(GROUPED) as StatusMeta['group'][]).map((group) => (
          <div key={group}>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              {GROUP_LABELS[group]}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {GROUPED[group].map((status) => {
                const meta = STATUS_CATALOG[status];
                return (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-2 py-0.5 text-xs"
                    title={meta.description}
                  >
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
