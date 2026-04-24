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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const password_util_1 = require("../../common/utils/password.util");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async findAll(query) {
        const filter = {};
        if (query.active !== 'all')
            filter.isActive = true;
        if (query.role)
            filter.role = query.role;
        if (query.search && query.search.trim().length > 0) {
            const regex = new RegExp(this.escapeRegex(query.search.trim()), 'i');
            filter.$or = [{ name: regex }, { email: regex }];
        }
        return this.userModel
            .find(filter)
            .populate('specialistId', 'name slug specialty')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id) {
        const user = await this.userModel
            .findById(id)
            .populate('specialistId', 'name slug specialty')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        return user;
    }
    async findByEmailWithPassword(email) {
        return this.userModel
            .findOne({ email: email.toLowerCase().trim(), isActive: true })
            .select('+passwordHash')
            .exec();
    }
    async create(dto) {
        const normalizedEmail = dto.email.toLowerCase().trim();
        const exists = await this.userModel.exists({ email: normalizedEmail });
        if (exists) {
            throw new common_1.ConflictException('Ya existe un usuario con ese correo');
        }
        const passwordHash = await (0, password_util_1.hashPassword)(dto.password);
        const created = await this.userModel.create({
            email: normalizedEmail,
            passwordHash,
            name: dto.name.trim(),
            role: dto.role,
            specialistId: dto.specialistId,
            isActive: dto.isActive ?? true,
        });
        return created;
    }
    async update(id, dto) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        if (dto.email) {
            const normalized = dto.email.toLowerCase().trim();
            if (normalized !== user.email) {
                const clash = await this.userModel.exists({ email: normalized, _id: { $ne: id } });
                if (clash) {
                    throw new common_1.ConflictException('Ya existe un usuario con ese correo');
                }
                user.email = normalized;
            }
        }
        if (dto.name !== undefined)
            user.name = dto.name.trim();
        if (dto.role !== undefined)
            user.role = dto.role;
        if (dto.specialistId !== undefined) {
            user.specialistId = dto.specialistId
                ? dto.specialistId
                : undefined;
        }
        if (dto.isActive !== undefined) {
            if (!dto.isActive && user.role === 'admin') {
                const otherAdmins = await this.userModel.countDocuments({
                    role: 'admin',
                    isActive: true,
                    _id: { $ne: id },
                });
                if (otherAdmins === 0) {
                    throw new common_1.BadRequestException('No se puede desactivar al último administrador activo');
                }
            }
            user.isActive = dto.isActive;
        }
        if (dto.password) {
            user.passwordHash = await (0, password_util_1.hashPassword)(dto.password);
        }
        await user.save();
        const fresh = await this.userModel
            .findById(id)
            .populate('specialistId', 'name slug specialty')
            .exec();
        return fresh;
    }
    async remove(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`Usuario con ID "${id}" no encontrado`);
        }
        if (user.role === 'admin' && user.isActive) {
            const otherAdmins = await this.userModel.countDocuments({
                role: 'admin',
                isActive: true,
                _id: { $ne: id },
            });
            if (otherAdmins === 0) {
                throw new common_1.BadRequestException('No se puede eliminar al último administrador activo');
            }
        }
        user.isActive = false;
        await user.save();
        return { id, isActive: user.isActive };
    }
    async touchLastLogin(id) {
        await this.userModel.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } }).exec();
    }
    escapeRegex(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map