'use client';

import ToothItem from './ToothItem';
import type { IToothRecord } from '@/types/odontogram';
import type { SurfaceName } from '@/lib/odontogram/status-catalog';

interface DentalArchProps {
  label: string;
  order: string[];
  teeth: IToothRecord[];
  onSelect: (
    tooth: IToothRecord,
    target: { type: 'tooth' } | { type: 'surface'; surface: SurfaceName },
  ) => void;
  selectedToothNumber?: string | null;
  disabled?: boolean;
}

export default function DentalArch({
  label,
  order,
  teeth,
  onSelect,
  selectedToothNumber,
  disabled,
}: DentalArchProps) {
  const byNumber = new Map(teeth.map((t) => [t.toothNumber, t]));

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="flex flex-wrap justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3">
        {order.map((number) => {
          const tooth = byNumber.get(number);
          if (!tooth) return null;
          return (
            <ToothItem
              key={number}
              tooth={tooth}
              onSelect={(target) => onSelect(tooth, target)}
              highlighted={selectedToothNumber === number}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
}
