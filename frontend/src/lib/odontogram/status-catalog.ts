export const TOOTH_STATUSES = [
  'healthy',
  'caries',
  'resin',
  'adapted_resin',
  'unadapted_resin',
  'amalgam',
  'adapted_amalgam',
  'unadapted_amalgam',
  'fracture',
  'good_crown',
  'defective_crown',
  'endodontics_done',
  'endodontics_pending',
  'extraction_indicated',
  'missing_tooth',
  'implant',
  'good_implant',
  'bad_implant',
  'prosthesis',
  'sealant',
  'orthodontics',
  'treatment_pending',
  'observation',
  'healthy_root',
  'affected_root',
  'mobility',
  'periodontal_issue',
] as const;

export type ToothStatus = (typeof TOOTH_STATUSES)[number];

export const SURFACE_NAMES = [
  'vestibular',
  'lingual_palatal',
  'mesial',
  'distal',
  'occlusal_incisal',
] as const;

export type SurfaceName = (typeof SURFACE_NAMES)[number];

export const PROCEDURE_STATUSES = [
  'none',
  'planned',
  'in_progress',
  'completed',
  'cancelled',
] as const;

export type ProcedureStatus = (typeof PROCEDURE_STATUSES)[number];

export interface StatusMeta {
  label: string;
  color: string; // hex
  textColor: string;
  group: 'healthy' | 'restoration' | 'surgery' | 'prosthetic' | 'pending' | 'periodontal';
  description: string;
}

export const STATUS_CATALOG: Record<ToothStatus, StatusMeta> = {
  healthy: {
    label: 'Sano',
    color: '#f1f5f9',
    textColor: '#334155',
    group: 'healthy',
    description: 'Diente en estado saludable, sin patologías visibles.',
  },
  caries: {
    label: 'Caries',
    color: '#ef4444',
    textColor: '#ffffff',
    group: 'restoration',
    description: 'Lesión cariosa activa.',
  },
  resin: {
    label: 'Resina',
    color: '#3b82f6',
    textColor: '#ffffff',
    group: 'restoration',
    description: 'Obturación de resina compuesta.',
  },
  adapted_resin: {
    label: 'Resina adaptada',
    color: '#60a5fa',
    textColor: '#0b2545',
    group: 'restoration',
    description: 'Resina en buen estado y adaptada.',
  },
  unadapted_resin: {
    label: 'Resina desadaptada',
    color: '#93c5fd',
    textColor: '#0b2545',
    group: 'restoration',
    description: 'Resina con desajuste o filtración.',
  },
  amalgam: {
    label: 'Amalgama',
    color: '#475569',
    textColor: '#ffffff',
    group: 'restoration',
    description: 'Obturación de amalgama.',
  },
  adapted_amalgam: {
    label: 'Amalgama adaptada',
    color: '#64748b',
    textColor: '#ffffff',
    group: 'restoration',
    description: 'Amalgama en buen estado.',
  },
  unadapted_amalgam: {
    label: 'Amalgama desadaptada',
    color: '#94a3b8',
    textColor: '#0f172a',
    group: 'restoration',
    description: 'Amalgama con desajuste o filtración.',
  },
  fracture: {
    label: 'Fractura',
    color: '#f97316',
    textColor: '#ffffff',
    group: 'surgery',
    description: 'Fractura coronaria o radicular.',
  },
  good_crown: {
    label: 'Corona buena',
    color: '#22c55e',
    textColor: '#0b3b14',
    group: 'prosthetic',
    description: 'Corona protésica en buen estado.',
  },
  defective_crown: {
    label: 'Corona defectuosa',
    color: '#facc15',
    textColor: '#3b2e00',
    group: 'prosthetic',
    description: 'Corona con problemas de ajuste o desgaste.',
  },
  endodontics_done: {
    label: 'Endodoncia realizada',
    color: '#9333ea',
    textColor: '#ffffff',
    group: 'surgery',
    description: 'Tratamiento endodóntico completado.',
  },
  endodontics_pending: {
    label: 'Endodoncia pendiente',
    color: '#c084fc',
    textColor: '#2a0042',
    group: 'pending',
    description: 'Indicación de endodoncia pendiente.',
  },
  extraction_indicated: {
    label: 'Extracción indicada',
    color: '#dc2626',
    textColor: '#ffffff',
    group: 'surgery',
    description: 'Diente con indicación de extracción.',
  },
  missing_tooth: {
    label: 'Ausente',
    color: '#111827',
    textColor: '#ffffff',
    group: 'surgery',
    description: 'Diente ausente en la arcada.',
  },
  implant: {
    label: 'Implante',
    color: '#0ea5e9',
    textColor: '#ffffff',
    group: 'prosthetic',
    description: 'Implante osteointegrado.',
  },
  good_implant: {
    label: 'Implante bueno',
    color: '#38bdf8',
    textColor: '#0b2545',
    group: 'prosthetic',
    description: 'Implante sin complicaciones.',
  },
  bad_implant: {
    label: 'Implante malo',
    color: '#f87171',
    textColor: '#ffffff',
    group: 'prosthetic',
    description: 'Implante con problemas o rechazo.',
  },
  prosthesis: {
    label: 'Prótesis',
    color: '#14b8a6',
    textColor: '#ffffff',
    group: 'prosthetic',
    description: 'Elemento protésico sobre el diente.',
  },
  sealant: {
    label: 'Sellante',
    color: '#a7f3d0',
    textColor: '#064e3b',
    group: 'restoration',
    description: 'Sellante de fosas y fisuras.',
  },
  orthodontics: {
    label: 'Ortodoncia',
    color: '#f472b6',
    textColor: '#4a044e',
    group: 'pending',
    description: 'Bracket o aparatología ortodóncica.',
  },
  treatment_pending: {
    label: 'Tratamiento pendiente',
    color: '#fde047',
    textColor: '#3b2e00',
    group: 'pending',
    description: 'Tratamiento planificado y pendiente de ejecución.',
  },
  observation: {
    label: 'En observación',
    color: '#fbbf24',
    textColor: '#3b2e00',
    group: 'pending',
    description: 'Requiere seguimiento periódico.',
  },
  healthy_root: {
    label: 'Raíz sana',
    color: '#86efac',
    textColor: '#064e3b',
    group: 'healthy',
    description: 'Raíz en buen estado.',
  },
  affected_root: {
    label: 'Raíz afectada',
    color: '#a3a3a3',
    textColor: '#1f2937',
    group: 'periodontal',
    description: 'Raíz con lesión o reabsorción.',
  },
  mobility: {
    label: 'Movilidad',
    color: '#fb923c',
    textColor: '#3b2e00',
    group: 'periodontal',
    description: 'Diente con movilidad patológica.',
  },
  periodontal_issue: {
    label: 'Problema periodontal',
    color: '#7c3aed',
    textColor: '#ffffff',
    group: 'periodontal',
    description: 'Compromiso periodontal relevante.',
  },
};

export const GROUP_LABELS: Record<StatusMeta['group'], string> = {
  healthy: 'Saludable',
  restoration: 'Restauraciones',
  surgery: 'Cirugía',
  prosthetic: 'Prótesis e implantes',
  pending: 'Pendientes / seguimiento',
  periodontal: 'Periodontal',
};

export const PROCEDURE_STATUS_LABELS: Record<ProcedureStatus, string> = {
  none: 'Sin registro',
  planned: 'Planificado',
  in_progress: 'En proceso',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
};

export const PROCEDURE_STATUS_COLORS: Record<ProcedureStatus, string> = {
  none: 'bg-slate-100 text-slate-700',
  planned: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export function statusMeta(status: ToothStatus): StatusMeta {
  return STATUS_CATALOG[status];
}

export function primaryStatusColor(statuses: ToothStatus[] | undefined): string {
  if (!statuses || statuses.length === 0) return STATUS_CATALOG.healthy.color;
  // Prefer the most recent non-healthy status for visual emphasis
  const nonHealthy = statuses.filter((s) => s !== 'healthy');
  const chosen = nonHealthy[nonHealthy.length - 1] ?? statuses[statuses.length - 1];
  return STATUS_CATALOG[chosen]?.color ?? STATUS_CATALOG.healthy.color;
}
