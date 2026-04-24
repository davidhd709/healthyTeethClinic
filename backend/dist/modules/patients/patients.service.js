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
exports.PatientsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const patient_schema_1 = require("./schemas/patient.schema");
const medical_histories_service_1 = require("../medical-histories/medical-histories.service");
function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1)
        return { firstName: parts[0], lastName: parts[0] };
    const firstName = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
    const lastName = parts.slice(Math.ceil(parts.length / 2)).join(' ');
    return { firstName, lastName };
}
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function parseBirthDate(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        throw new common_1.BadRequestException('Fecha de nacimiento inválida');
    }
    const today = new Date();
    if (parsed.getTime() > today.getTime()) {
        throw new common_1.BadRequestException('La fecha de nacimiento no puede ser futura');
    }
    return parsed;
}
let PatientsService = class PatientsService {
    constructor(patientModel, medicalHistoriesService) {
        this.patientModel = patientModel;
        this.medicalHistoriesService = medicalHistoriesService;
    }
    async findAll(query) {
        const filter = {};
        if (query.active === 'inactive') {
            filter.isActive = false;
        }
        else if (query.active !== 'all') {
            filter.isActive = true;
        }
        if (query.search && query.search.trim().length > 0) {
            const regex = new RegExp(escapeRegex(query.search.trim()), 'i');
            filter.$or = [
                { firstName: regex },
                { lastName: regex },
                { documentNumber: regex },
                { phone: regex },
                { email: regex },
            ];
        }
        const page = Math.max(1, query.page ?? 1);
        const limit = Math.min(100, Math.max(1, query.limit ?? 20));
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.patientModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.patientModel.countDocuments(filter).exec(),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        };
    }
    async findOne(id) {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient) {
            throw new common_1.NotFoundException(`Paciente con ID "${id}" no encontrado`);
        }
        return patient;
    }
    async findByDocument(documentNumber) {
        return this.patientModel
            .findOne({ documentNumber: documentNumber.trim() })
            .exec();
    }
    async create(dto, createdBy) {
        const normalized = dto.documentNumber.trim();
        const exists = await this.patientModel.exists({ documentNumber: normalized });
        if (exists) {
            throw new common_1.ConflictException('Ya existe un paciente con ese número de documento');
        }
        const birthDate = parseBirthDate(dto.birthDate);
        const created = await this.patientModel.create({
            ...dto,
            documentNumber: normalized,
            email: dto.email?.toLowerCase().trim(),
            birthDate,
            isActive: dto.isActive ?? true,
            createdBy: createdBy ? new mongoose_2.Types.ObjectId(createdBy) : undefined,
            updatedBy: createdBy ? new mongoose_2.Types.ObjectId(createdBy) : undefined,
        });
        await this.medicalHistoriesService.ensureForPatient(String(created._id), createdBy);
        return created;
    }
    async update(id, dto, updatedBy) {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient) {
            throw new common_1.NotFoundException(`Paciente con ID "${id}" no encontrado`);
        }
        if (dto.documentNumber) {
            const normalized = dto.documentNumber.trim();
            if (normalized !== patient.documentNumber) {
                const clash = await this.patientModel.exists({
                    documentNumber: normalized,
                    _id: { $ne: id },
                });
                if (clash) {
                    throw new common_1.ConflictException('Ya existe un paciente con ese número de documento');
                }
                patient.documentNumber = normalized;
            }
        }
        if (dto.birthDate)
            patient.birthDate = parseBirthDate(dto.birthDate);
        if (dto.email !== undefined) {
            patient.email = dto.email ? dto.email.toLowerCase().trim() : undefined;
        }
        const scalarFields = [
            'documentType',
            'firstName',
            'lastName',
            'sex',
            'phone',
            'address',
            'city',
            'insuranceProvider',
            'observations',
        ];
        for (const field of scalarFields) {
            if (dto[field] !== undefined) {
                patient[field] = dto[field];
            }
        }
        if (dto.emergencyContact !== undefined) {
            patient.emergencyContact = dto.emergencyContact;
        }
        if (dto.medicalInfo !== undefined) {
            patient.medicalInfo = {
                allergies: dto.medicalInfo.allergies ?? patient.medicalInfo?.allergies ?? [],
                diseases: dto.medicalInfo.diseases ?? patient.medicalInfo?.diseases ?? [],
                medications: dto.medicalInfo.medications ?? patient.medicalInfo?.medications ?? [],
                medicalHistory: dto.medicalInfo.medicalHistory ?? patient.medicalInfo?.medicalHistory,
                dentalHistory: dto.medicalInfo.dentalHistory ?? patient.medicalInfo?.dentalHistory,
            };
        }
        if (dto.isActive !== undefined) {
            patient.isActive = dto.isActive;
            patient.deletedAt = dto.isActive ? undefined : new Date();
        }
        if (updatedBy) {
            patient.updatedBy = new mongoose_2.Types.ObjectId(updatedBy);
        }
        await patient.save();
        return patient;
    }
    async remove(id, updatedBy) {
        const patient = await this.patientModel.findById(id).exec();
        if (!patient) {
            throw new common_1.NotFoundException(`Paciente con ID "${id}" no encontrado`);
        }
        patient.isActive = false;
        patient.deletedAt = new Date();
        if (updatedBy) {
            patient.updatedBy = new mongoose_2.Types.ObjectId(updatedBy);
        }
        await patient.save();
        return { id, isActive: patient.isActive };
    }
    async resolveOrCreateForAppointment(input) {
        if (!input.documentNumber || !input.documentNumber.trim()) {
            return { patient: null, wasCreated: false };
        }
        const documentNumber = input.documentNumber.trim();
        const existing = await this.patientModel
            .findOne({ documentNumber })
            .exec();
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                existing.deletedAt = undefined;
                await existing.save();
            }
            return { patient: existing, wasCreated: false };
        }
        const { firstName, lastName } = splitName(input.name);
        const placeholderBirth = new Date('1900-01-01T00:00:00.000Z');
        const created = await this.patientModel.create({
            documentType: 'CC',
            documentNumber,
            firstName,
            lastName,
            birthDate: placeholderBirth,
            sex: 'O',
            phone: input.phone?.trim() ?? '0000000',
            email: input.email?.toLowerCase().trim(),
            medicalInfo: { allergies: [], diseases: [], medications: [] },
            isActive: true,
            observations: 'Paciente creado automáticamente desde una cita. Completar datos clínicos.',
        });
        return { patient: created, wasCreated: true };
    }
};
exports.PatientsService = PatientsService;
exports.PatientsService = PatientsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(patient_schema_1.Patient.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        medical_histories_service_1.MedicalHistoriesService])
], PatientsService);
//# sourceMappingURL=patients.service.js.map