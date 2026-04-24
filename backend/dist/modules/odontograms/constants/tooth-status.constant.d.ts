export declare const TOOTH_STATUSES: readonly ["healthy", "caries", "resin", "adapted_resin", "unadapted_resin", "amalgam", "adapted_amalgam", "unadapted_amalgam", "fracture", "good_crown", "defective_crown", "endodontics_done", "endodontics_pending", "extraction_indicated", "missing_tooth", "implant", "good_implant", "bad_implant", "prosthesis", "sealant", "orthodontics", "treatment_pending", "observation", "healthy_root", "affected_root", "mobility", "periodontal_issue"];
export type ToothStatus = (typeof TOOTH_STATUSES)[number];
export declare const SURFACE_NAMES: readonly ["vestibular", "lingual_palatal", "mesial", "distal", "occlusal_incisal"];
export type SurfaceName = (typeof SURFACE_NAMES)[number];
export declare const PROCEDURE_STATUSES: readonly ["none", "planned", "in_progress", "completed", "cancelled"];
export type ProcedureStatus = (typeof PROCEDURE_STATUSES)[number];
