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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OdontogramsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const odontogram_schema_1 = require("./schemas/odontogram.schema");
const odontogram_history_schema_1 = require("./schemas/odontogram-history.schema");
const fdi_teeth_constant_1 = require("./constants/fdi-teeth.constant");
const tooth_status_constant_1 = require("./constants/tooth-status.constant");
function toObjectId(value) {
    if (!value || !mongoose_2.Types.ObjectId.isValid(value))
        return undefined;
    return new mongoose_2.Types.ObjectId(value);
}
function buildInitialTeeth() {
    return fdi_teeth_constant_1.FDI_TEETH.map((t) => ({
        toothNumber: t.toothNumber,
        toothType: t.toothType,
        quadrant: t.quadrant,
        arch: t.arch,
        status: ['healthy'],
        surfaces: {
            vestibular: { status: 'none' },
            lingual_palatal: { status: 'none' },
            mesial: { status: 'none' },
            distal: { status: 'none' },
            occlusal_incisal: { status: 'none' },
        },
        diagnosis: [],
    }));
}
function assertSurface(surface) {
    if (!tooth_status_constant_1.SURFACE_NAMES.includes(surface)) {
        throw new common_1.BadRequestException(`Superficie inválida: ${surface}`);
    }
}
let OdontogramsService = class OdontogramsService {
    constructor(odontogramModel, historyModel) {
        this.odontogramModel = odontogramModel;
        this.historyModel = historyModel;
    }
    async getOrCreateByPatient(patientId, createdBy) {
        if (!mongoose_2.Types.ObjectId.isValid(patientId)) {
            throw new common_1.BadRequestException('ID de paciente inválido');
        }
        const oid = new mongoose_2.Types.ObjectId(patientId);
        const existing = await this.odontogramModel.findOne({ patientId: oid }).exec();
        if (existing) {
            if (!existing.teeth || existing.teeth.length === 0) {
                existing.teeth = buildInitialTeeth();
                await existing.save();
            }
            return existing;
        }
        const created = await this.odontogramModel.create({
            patientId: oid,
            dentitionType: 'permanent',
            teeth: buildInitialTeeth(),
            isActive: true,
            createdBy: toObjectId(createdBy),
            updatedBy: toObjectId(createdBy),
        });
        return created;
    }
    async updateTooth(patientId, toothNumber, dto, updatedBy) {
        const odontogram = await this.getOrCreateByPatient(patientId, updatedBy);
        const tooth = odontogram.teeth.find((t) => t.toothNumber === toothNumber);
        if (!tooth) {
            throw new common_1.NotFoundException(`Diente ${toothNumber} no encontrado`);
        }
        const previousStatus = [...(tooth.status ?? [])];
        let changed = false;
        if (dto.status) {
            tooth.status = dto.status;
            changed = true;
        }
        if (dto.diagnosis !== undefined) {
            tooth.diagnosis = dto.diagnosis;
            changed = true;
        }
        if (dto.notes !== undefined) {
            tooth.notes = dto.notes;
            changed = true;
        }
        if (changed) {
            tooth.lastUpdated = new Date();
            tooth.updatedBy = toObjectId(updatedBy);
            odontogram.updatedBy = toObjectId(updatedBy);
            await odontogram.save();
            if (dto.status) {
                await this.recordHistory({
                    patientId: odontogram.patientId,
                    toothNumber,
                    previousStatus,
                    newStatus: tooth.status,
                    notes: dto.notes,
                    specialistId: toObjectId(dto.specialistId),
                    updatedBy: toObjectId(updatedBy),
                    source: 'manual',
                });
            }
        }
        return odontogram;
    }
    async updateSurface(patientId, toothNumber, surface, dto, updatedBy) {
        assertSurface(surface);
        const odontogram = await this.getOrCreateByPatient(patientId, updatedBy);
        const tooth = odontogram.teeth.find((t) => t.toothNumber === toothNumber);
        if (!tooth) {
            throw new common_1.NotFoundException(`Diente ${toothNumber} no encontrado`);
        }
        const surfaceRecord = tooth.surfaces[surface];
        const previousCondition = surfaceRecord?.condition;
        if (dto.condition !== undefined)
            surfaceRecord.condition = dto.condition;
        if (dto.treatment !== undefined)
            surfaceRecord.treatment = dto.treatment;
        if (dto.status !== undefined)
            surfaceRecord.status = dto.status;
        if (dto.notes !== undefined)
            surfaceRecord.notes = dto.notes;
        if (dto.date !== undefined) {
            const parsed = new Date(dto.date);
            if (Number.isNaN(parsed.getTime())) {
                throw new common_1.BadRequestException('Fecha inválida');
            }
            surfaceRecord.date = parsed;
        }
        if (dto.specialistId !== undefined) {
            surfaceRecord.specialistId = toObjectId(dto.specialistId);
        }
        surfaceRecord.lastUpdated = new Date();
        surfaceRecord.updatedBy = toObjectId(updatedBy);
        tooth.lastUpdated = surfaceRecord.lastUpdated;
        tooth.updatedBy = surfaceRecord.updatedBy;
        odontogram.updatedBy = toObjectId(updatedBy);
        odontogram.markModified('teeth');
        await odontogram.save();
        if (dto.condition !== undefined && dto.condition !== previousCondition) {
            await this.recordHistory({
                patientId: odontogram.patientId,
                toothNumber,
                surface,
                previousStatus: previousCondition ? [previousCondition] : [],
                newStatus: dto.condition ? [dto.condition] : [],
                diagnosis: dto.condition,
                procedure: dto.treatment,
                notes: dto.notes,
                specialistId: toObjectId(dto.specialistId),
                updatedBy: toObjectId(updatedBy),
                source: 'manual',
            });
        }
        return odontogram;
    }
    async getHistory(patientId, options = {}) {
        if (!mongoose_2.Types.ObjectId.isValid(patientId)) {
            throw new common_1.BadRequestException('ID de paciente inválido');
        }
        const filter = {
            patientId: new mongoose_2.Types.ObjectId(patientId),
        };
        if (options.toothNumber)
            filter.toothNumber = options.toothNumber;
        if (options.surface) {
            assertSurface(options.surface);
            filter.surface = options.surface;
        }
        const limit = Math.min(Math.max(1, options.limit ?? 200), 1000);
        return this.historyModel
            .find(filter)
            .populate('specialistId', 'name slug specialty')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async recordHistory(input) {
        await this.historyModel.create({
            patientId: input.patientId,
            toothNumber: input.toothNumber,
            surface: input.surface,
            previousStatus: input.previousStatus,
            newStatus: input.newStatus,
            diagnosis: input.diagnosis,
            procedure: input.procedure,
            notes: input.notes,
            specialistId: input.specialistId,
            updatedBy: input.updatedBy,
            source: input.source,
        });
    }
};
exports.OdontogramsService = OdontogramsService;
exports.OdontogramsService = OdontogramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(odontogram_schema_1.Odontogram.name)),
    __param(1, (0, mongoose_1.InjectModel)(odontogram_history_schema_1.OdontogramHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], OdontogramsService);
//# sourceMappingURL=odontograms.service.js.map