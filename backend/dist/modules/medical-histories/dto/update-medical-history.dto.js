"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMedicalHistoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateMedicalHistoryDto {
}
exports.UpdateMedicalHistoryDto = UpdateMedicalHistoryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Motivo de consulta actual' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "chiefComplaint", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Diagnóstico inicial' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "initialDiagnosis", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Plan de tratamiento' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "treatmentPlan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Observaciones clínicas generales' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicalHistoryDto.prototype, "generalObservations", void 0);
//# sourceMappingURL=update-medical-history.dto.js.map