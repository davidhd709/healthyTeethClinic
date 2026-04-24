import type { ToothStatus, SurfaceName, ProcedureStatus } from '@/lib/odontogram/status-catalog';
import type { ToothType, Arch, Quadrant } from '@/lib/odontogram/fdi-teeth';

export interface IToothSurfaceRecord {
  condition?: ToothStatus;
  treatment?: string;
  status: ProcedureStatus;
  notes?: string;
  date?: string;
  specialistId?: string | { _id: string; name: string; slug: string; specialty: string };
  lastUpdated?: string;
  updatedBy?: string;
}

export type ToothSurfacesMap = Record<SurfaceName, IToothSurfaceRecord>;

export interface IToothRecord {
  toothNumber: string;
  toothType: ToothType;
  quadrant: Quadrant;
  arch: Arch;
  status: ToothStatus[];
  surfaces: ToothSurfacesMap;
  diagnosis: string[];
  notes?: string;
  lastUpdated?: string;
  updatedBy?: string;
}

export interface IOdontogram {
  _id: string;
  patientId: string;
  dentitionType: 'permanent' | 'temporary' | 'mixed';
  teeth: IToothRecord[];
  isActive: boolean;
  deletedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOdontogramHistoryEntry {
  _id: string;
  patientId: string;
  toothNumber: string;
  surface?: SurfaceName;
  previousStatus: ToothStatus[];
  newStatus: ToothStatus[];
  diagnosis?: string;
  procedure?: string;
  notes?: string;
  source: 'manual' | 'procedure';
  updatedBy?: string;
  specialistId?: string | { _id: string; name: string; slug: string; specialty: string };
  createdAt: string;
  updatedAt: string;
}
