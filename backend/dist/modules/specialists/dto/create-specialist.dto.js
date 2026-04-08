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
exports.CreateSpecialistDto = exports.WeeklyScheduleDto = exports.BreakDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class BreakDto {
}
exports.BreakDto = BreakDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BreakDto.prototype, "start", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '13:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BreakDto.prototype, "end", void 0);
class WeeklyScheduleDto {
}
exports.WeeklyScheduleDto = WeeklyScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'lunes' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WeeklyScheduleDto.prototype, "day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WeeklyScheduleDto.prototype, "startTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '17:00' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WeeklyScheduleDto.prototype, "endTime", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WeeklyScheduleDto.prototype, "blockDuration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [BreakDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => BreakDto),
    __metadata("design:type", Array)
], WeeklyScheduleDto.prototype, "breaks", void 0);
class CreateSpecialistDto {
}
exports.CreateSpecialistDto = CreateSpecialistDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Dra. María Alejandra Rodríguez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'dra-maria-rodriguez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/images/specialist-1.jpg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Odontología General' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "specialty", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Odontología Preventiva' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "subspecialty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción profesional del especialista' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateSpecialistDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Años de experiencia', example: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateSpecialistDto.prototype, "experience", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'IDs de servicios asociados', type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateSpecialistDto.prototype, "services", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horario semanal', type: [WeeklyScheduleDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => WeeklyScheduleDto),
    __metadata("design:type", Array)
], CreateSpecialistDto.prototype, "weeklySchedule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateSpecialistDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-specialist.dto.js.map