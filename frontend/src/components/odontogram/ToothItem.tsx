'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { IToothRecord } from '@/types/odontogram';
import type { SurfaceName } from '@/lib/odontogram/status-catalog';
import { STATUS_CATALOG, primaryStatusColor } from '@/lib/odontogram/status-catalog';

type ClickTarget =
  | { type: 'tooth' }
  | { type: 'surface'; surface: SurfaceName };

interface ToothItemProps {
  tooth: IToothRecord;
  onSelect: (target: ClickTarget) => void;
  highlighted?: boolean;
  disabled?: boolean;
}

function surfaceFill(tooth: IToothRecord, surface: SurfaceName): string {
  const record = tooth.surfaces?.[surface];
  if (record?.condition) {
    return STATUS_CATALOG[record.condition].color;
  }
  return '#ffffff';
}

// For quadrants 1 and 4 (right side of patient), mesial is on the right of the viewer.
// For quadrants 2 and 3 (left side of patient), mesial is on the left of the viewer.
function surfacePositions(quadrant: IToothRecord['quadrant']): Record<'left' | 'right', SurfaceName> {
  if (quadrant === 1 || quadrant === 4) {
    return { left: 'distal', right: 'mesial' };
  }
  return { left: 'mesial', right: 'distal' };
}

function ToothItemInner({
  tooth,
  onSelect,
  highlighted = false,
  disabled = false,
}: ToothItemProps) {
  const { left, right } = surfacePositions(tooth.quadrant);
  const isMissing = tooth.status.includes('missing_tooth');
  const borderColor = primaryStatusColor(tooth.status);
  const pendingSurfaces = tooth.surfaces
    ? Object.values(tooth.surfaces).filter((s) => s.status === 'planned' || s.status === 'in_progress').length
    : 0;
  const completedSurfaces = tooth.surfaces
    ? Object.values(tooth.surfaces).filter((s) => s.status === 'completed').length
    : 0;

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-1 transition-opacity',
        disabled && 'opacity-80',
      )}
    >
      <span className="text-[10px] font-semibold text-slate-500">{tooth.toothNumber}</span>
      <svg
        viewBox="0 0 60 60"
        width={44}
        height={44}
        role="img"
        aria-label={`Diente ${tooth.toothNumber}`}
        className={cn(
          'rounded-md bg-white shadow-sm transition-all',
          highlighted && 'ring-2 ring-cyan-500 ring-offset-1',
          isMissing && 'opacity-50',
        )}
        style={{ outline: `2px solid ${borderColor}`, outlineOffset: -2 }}
      >
        {/* Vestibular (top) */}
        <polygon
          points="6,6 54,6 42,22 18,22"
          fill={surfaceFill(tooth, 'vestibular')}
          stroke="#cbd5e1"
          strokeWidth="1"
          className={cn(!disabled && 'cursor-pointer hover:opacity-80')}
          onClick={() => !disabled && onSelect({ type: 'surface', surface: 'vestibular' })}
        />
        {/* Lingual/palatal (bottom) */}
        <polygon
          points="18,38 42,38 54,54 6,54"
          fill={surfaceFill(tooth, 'lingual_palatal')}
          stroke="#cbd5e1"
          strokeWidth="1"
          className={cn(!disabled && 'cursor-pointer hover:opacity-80')}
          onClick={() => !disabled && onSelect({ type: 'surface', surface: 'lingual_palatal' })}
        />
        {/* Left side */}
        <polygon
          points="6,6 18,22 18,38 6,54"
          fill={surfaceFill(tooth, left)}
          stroke="#cbd5e1"
          strokeWidth="1"
          className={cn(!disabled && 'cursor-pointer hover:opacity-80')}
          onClick={() => !disabled && onSelect({ type: 'surface', surface: left })}
        />
        {/* Right side */}
        <polygon
          points="54,6 54,54 42,38 42,22"
          fill={surfaceFill(tooth, right)}
          stroke="#cbd5e1"
          strokeWidth="1"
          className={cn(!disabled && 'cursor-pointer hover:opacity-80')}
          onClick={() => !disabled && onSelect({ type: 'surface', surface: right })}
        />
        {/* Occlusal / incisal (center) */}
        <rect
          x="18"
          y="22"
          width="24"
          height="16"
          fill={surfaceFill(tooth, 'occlusal_incisal')}
          stroke="#cbd5e1"
          strokeWidth="1"
          className={cn(!disabled && 'cursor-pointer hover:opacity-80')}
          onClick={() => !disabled && onSelect({ type: 'surface', surface: 'occlusal_incisal' })}
        />
        {/* Overlay for missing tooth */}
        {isMissing && (
          <>
            <line x1="6" y1="6" x2="54" y2="54" stroke="#991b1b" strokeWidth="2.5" />
            <line x1="54" y1="6" x2="6" y2="54" stroke="#991b1b" strokeWidth="2.5" />
          </>
        )}
        {/* Click-through layer for opening tooth panel: use number below */}
      </svg>
      <button
        type="button"
        onClick={() => !disabled && onSelect({ type: 'tooth' })}
        disabled={disabled}
        className="flex items-center gap-1 rounded px-1 text-[9px] font-medium text-slate-500 hover:text-cyan-700"
        title="Abrir panel del diente"
      >
        {pendingSurfaces > 0 && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" title="Pendientes" />
        )}
        {completedSurfaces > 0 && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" title="Finalizados" />
        )}
        Detalle
      </button>
    </div>
  );
}

export default memo(ToothItemInner);
