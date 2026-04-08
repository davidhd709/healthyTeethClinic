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
exports.SpecialistsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const specialist_schema_1 = require("./schemas/specialist.schema");
let SpecialistsService = class SpecialistsService {
    constructor(specialistModel) {
        this.specialistModel = specialistModel;
    }
    async findAll(onlyActive = true) {
        const filter = onlyActive ? { isActive: true } : {};
        return this.specialistModel
            .find(filter)
            .populate('services', 'name slug icon durationMinutes')
            .sort({ name: 1 })
            .exec();
    }
    async findOne(id) {
        const specialist = await this.specialistModel
            .findById(id)
            .populate('services', 'name slug icon durationMinutes')
            .exec();
        if (!specialist) {
            throw new common_1.NotFoundException(`Especialista con ID "${id}" no encontrado`);
        }
        return specialist;
    }
    async findBySlug(slug) {
        const specialist = await this.specialistModel
            .findOne({ slug })
            .populate('services', 'name slug icon durationMinutes')
            .exec();
        if (!specialist) {
            throw new common_1.NotFoundException(`Especialista con slug "${slug}" no encontrado`);
        }
        return specialist;
    }
    async create(dto) {
        if (!dto.slug) {
            dto.slug = this.generateSlug(dto.name);
        }
        return this.specialistModel.create(dto);
    }
    async update(id, dto) {
        const specialist = await this.specialistModel
            .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
            .exec();
        if (!specialist) {
            throw new common_1.NotFoundException(`Especialista con ID "${id}" no encontrado`);
        }
        return specialist;
    }
    async remove(id) {
        const specialist = await this.specialistModel.findByIdAndDelete(id).exec();
        if (!specialist) {
            throw new common_1.NotFoundException(`Especialista con ID "${id}" no encontrado`);
        }
        return specialist;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.SpecialistsService = SpecialistsService;
exports.SpecialistsService = SpecialistsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(specialist_schema_1.Specialist.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SpecialistsService);
//# sourceMappingURL=specialists.service.js.map