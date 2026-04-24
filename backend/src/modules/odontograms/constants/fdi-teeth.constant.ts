export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';
export type Arch = 'upper' | 'lower';

export interface FdiToothDefinition {
  toothNumber: string;
  toothType: ToothType;
  quadrant: 1 | 2 | 3 | 4;
  arch: Arch;
}

function toothType(number: number): ToothType {
  const unit = number % 10;
  if (unit <= 2) return 'incisor';
  if (unit === 3) return 'canine';
  if (unit <= 5) return 'premolar';
  return 'molar';
}

function buildQuadrant(
  quadrant: 1 | 2 | 3 | 4,
  arch: Arch,
): FdiToothDefinition[] {
  const base = quadrant * 10;
  return Array.from({ length: 8 }, (_, i) => {
    const unit = i + 1;
    const number = base + unit;
    return {
      toothNumber: String(number),
      toothType: toothType(number),
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

export const FDI_TOOTH_NUMBERS: string[] = FDI_TEETH.map((t) => t.toothNumber);
