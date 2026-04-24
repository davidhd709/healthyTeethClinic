export type ToothType = 'incisor' | 'canine' | 'premolar' | 'molar';
export type Arch = 'upper' | 'lower';
export interface FdiToothDefinition {
    toothNumber: string;
    toothType: ToothType;
    quadrant: 1 | 2 | 3 | 4;
    arch: Arch;
}
export declare const FDI_TEETH: FdiToothDefinition[];
export declare const FDI_TOOTH_NUMBERS: string[];
