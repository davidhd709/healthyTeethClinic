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
exports.MedicalHistoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const medical_history_schema_1 = require("./schemas/medical-history.schema");
function toObjectId(value) {
    if (!value)
        return undefined;
    if (!mongoose_2.Types.ObjectId.isValid(value))
        return undefined;
    return new mongoose_2.Types.ObjectId(value);
}
function parseOptionalDate(value) {
    if (!value)
        return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new common_1.BadRequestException('Fecha inválida');
    }
    return date;
}
let MedicalHistoriesService = class MedicalHistoriesService {
    constructor(historyModel) {
        this.historyModel = historyModel;
    }
    async getOrCreateByPatient(patientId, createdBy) {
        if (!mongoose_2.Types.ObjectId.isValid(patientId)) {
            throw new common_1.BadRequestException('ID de paciente inválido');
        }
        const oid = new mongoose_2.Types.ObjectId(patientId);
        const existing = await this.historyModel
            .findOne({ patientId: oid })
            .populate('evolutions.specialistId', 'name slug specialty')
            .exec();
        if (existing)
            return existing;
        const created = await this.historyModel.create({
            patientId: oid,
            evolutions: [],
            isActive: true,
            createdBy: toObjectId(createdBy),
            updatedBy: toObjectId(createdBy),
        });
        return this.historyModel
            .findById(created._id)
            .populate('evolutions.specialistId', 'name slug specialty')
            .exec();
    }
    async ensureForPatient(patientId, createdBy) {
        const oid = new mongoose_2.Types.ObjectId(patientId);
        await this.historyModel
            .updateOne({ patientId: oid }, {
            $setOnInsert: {
                patientId: oid,
                evolutions: [],
                isActive: true,
                createdBy: toObjectId(createdBy),
                updatedBy: toObjectId(createdBy),
            },
        }, { upsert: true })
            .exec();
    }
    async updateMain(patientId, dto, updatedBy) {
        const history = await this.getOrCreateByPatient(patientId, updatedBy);
        if (!history) {
            throw new common_1.NotFoundException('Historia clínica no encontrada');
        }
        const fields = [
            'chiefComplaint',
            'initialDiagnosis',
            'treatmentPlan',
            'generalObservations',
        ];
        for (const field of fields) {
            if (dto[field] !== undefined) {
                history[field] = dto[field];
            }
        }
        if (updatedBy) {
            history.updatedBy = toObjectId(updatedBy);
        }
        await history.save();
        return this.historyModel
            .findById(history._id)
            .populate('evolutions.specialistId', 'name slug specialty')
            .exec();
    }
    async addEvolution(patientId, dto, createdBy) {
        const history = await this.getOrCreateByPatient(patientId, createdBy);
        if (!history) {
            throw new common_1.NotFoundException('Historia clínica no encontrada');
        }
        const evolution = {
            _id: new mongoose_2.Types.ObjectId(),
            date: parseOptionalDate(dto.date) ?? new Date(),
            specialistId: toObjectId(dto.specialistId),
            description: dto.description,
            diagnosis: dto.diagnosis,
            treatment: dto.treatment,
            recommendations: dto.recommendations,
            nextAppointmentSuggestion: parseOptionalDate(dto.nextAppointmentSuggestion),
            createdBy: toObjectId(createdBy),
            updatedBy: toObjectId(createdBy),
        };
        history.evolutions.push(evolution);
        if (createdBy) {
            history.updatedBy = toObjectId(createdBy);
        }
        await history.save();
        return this.historyModel
            .findById(history._id)
            .populate('evolutions.specialistId', 'name slug specialty')
            .exec();
    }
    async updateEvolution(patientId, evolutionId, dto, updatedBy) {
        if (!mongoose_2.Types.ObjectId.isValid(evolutionId)) {
            throw new common_1.BadRequestException('ID de evolución inválido');
        }
        const history = await this.getOrCreateByPatient(patientId, updatedBy);
        if (!history) {
            throw new common_1.NotFoundException('Historia clínica no encontrada');
        }
        const evolution = history.evolutions.find((ev) => String(ev._id) === evolutionId);
        if (!evolution) {
            throw new common_1.NotFoundException('Evolución no encontrada');
        }
        if (dto.date !== undefined) {
            const parsed = parseOptionalDate(dto.date);
            if (parsed)
                evolution.date = parsed;
        }
        if (dto.specialistId !== undefined) {
            evolution.specialistId = toObjectId(dto.specialistId);
        }
        if (dto.description !== undefined)
            evolution.description = dto.description;
        if (dto.diagnosis !== undefined)
            evolution.diagnosis = dto.diagnosis;
        if (dto.treatment !== undefined)
            evolution.treatment = dto.treatment;
        if (dto.recommendations !== undefined)
            evolution.recommendations = dto.recommendations;
        if (dto.nextAppointmentSuggestion !== undefined) {
            evolution.nextAppointmentSuggestion = parseOptionalDate(dto.nextAppointmentSuggestion);
        }
        evolution.updatedBy = toObjectId(updatedBy);
        if (updatedBy) {
            history.updatedBy = toObjectId(updatedBy);
        }
        await history.save();
        return this.historyModel
            .findById(history._id)
            .populate('evolutions.specialistId', 'name slug specialty')
            .exec();
    }
};
exports.MedicalHistoriesService = MedicalHistoriesService;
exports.MedicalHistoriesService = MedicalHistoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(medical_history_schema_1.MedicalHistory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MedicalHistoriesService);
//# sourceMappingURL=medical-histories.service.js.map