export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';
export type Arch = 'upper' | 'lower';
export type Quadrant = 1 | 2 | 3 | 4;

export interface FdiToothDefinition {
  toothNumber: string;
  toothType: ToothType;
  quadrant: Quadrant;
  arch: Arch;
}

function toothType(n: number): ToothType {
  const unit = n % 10;
  if (unit <= 2) return 'incisor';
  if (unit === 3) return 'canine';
  if (unit <= 5) return 'premolar';
  return 'molar';
}

function buildQuadrant(quadrant: Quadrant, arch: Arch): FdiToothDefinition[] {
  const base = quadrant * 10;
  return Array.from({ length: 8 }, (_, i) => {
    const n = base + (i + 1);
    return {
      toothNumber: String(n),
      toothType: toothType(n),
      quadrant,
      arch,
    };
  });
}

export const FDI_TEETH: FdiToothDefinition[] = [
  ...buildQuadrant(1, 'upper'),
  ...buildQuadrant(2, 'upper'),
  ...buildQuadrant(3, 'lower'),
  ...buildQuadrant(4, 'lower'),
];

// Clinical display order: from patient's right (quadrants 1, 4) to left (quadrants 2, 3)
// Upper: 18,17,16,15,14,13,12,11 | 21,22,23,24,25,26,27,28
// Lower: 48,47,46,45,44,43,42,41 | 31,32,33,34,35,36,37,38
export const UPPER_ARCH_ORDER: string[] = [
  '18', '17', '16', '15', '14', '13', '12', '11',
  '21', '22', '23', '24', '25', '26', '27', '28',
];

export const LOWER_ARCH_ORDER: string[] = [
  '48', '47', '46', '45', '44', '43', '42', '41',
  '31', '32', '33', '34', '35', '36', '37', '38',
];

export const TOOTH_TYPE_LABELS: Record<ToothType, string> = {
  incisor: 'Incisivo',
  canine: 'Canino',
  premolar: 'Premolar',
  molar: 'Molar',
};

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  1: 'Superior derecho',
  2: 'Superior izquierdo',
  3: 'Inferior izquierdo',
  4: 'Inferior derecho',
};

export function getToothDefinition(toothNumber: string): FdiToothDefinition | undefined {
  return FDI_TEETH.find((t) => t.toothNumber === toothNumber);
}

export function occlusalLabel(toothType: ToothType): 'Oclusal' | 'Incisal' {
  return toothType === 'molar' || toothType === 'premolar' ? 'Oclusal' : 'Incisal';
}
