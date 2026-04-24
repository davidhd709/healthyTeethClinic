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
