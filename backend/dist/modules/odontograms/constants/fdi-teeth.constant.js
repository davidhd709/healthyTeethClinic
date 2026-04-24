"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FDI_TOOTH_NUMBERS = exports.FDI_TEETH = void 0;
function toothType(number) {
    const unit = number % 10;
    if (unit <= 2)
        return 'incisor';
    if (unit === 3)
        return 'canine';
    if (unit <= 5)
        return 'premolar';
    return 'molar';
}
function buildQuadrant(quadrant, arch) {
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
exports.FDI_TEETH = [
    ...buildQuadrant(1, 'upper'),
    ...buildQuadrant(2, 'upper'),
    ...buildQuadrant(3, 'lower'),
    ...buildQuadrant(4, 'lower'),
];
exports.FDI_TOOTH_NUMBERS = exports.FDI_TEETH.map((t) => t.toothNumber);
//# sourceMappingURL=fdi-teeth.constant.js.map