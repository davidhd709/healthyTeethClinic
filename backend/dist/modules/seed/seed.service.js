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
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const service_schema_1 = require("../services/schemas/service.schema");
const specialist_schema_1 = require("../specialists/schemas/specialist.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const contact_schema_1 = require("../contact/schemas/contact.schema");
const seed_data_1 = require("./seed.data");
let SeedService = class SeedService {
    constructor(serviceModel, specialistModel, appointmentModel, contactModel) {
        this.serviceModel = serviceModel;
        this.specialistModel = specialistModel;
        this.appointmentModel = appointmentModel;
        this.contactModel = contactModel;
    }
    async seed() {
        await Promise.all([
            this.serviceModel.deleteMany({}),
            this.specialistModel.deleteMany({}),
            this.appointmentModel.deleteMany({}),
            this.contactModel.deleteMany({}),
        ]);
        const insertedServices = await this.serviceModel.insertMany(seed_data_1.servicesData);
        const serviceSlugMap = new Map();
        for (const service of insertedServices) {
            serviceSlugMap.set(service.slug, service._id);
        }
        const specialistsToInsert = seed_data_1.specialistsData.map((specialist) => {
            const { servicesSlugs, ...rest } = specialist;
            const serviceIds = servicesSlugs
                .map((slug) => serviceSlugMap.get(slug))
                .filter(Boolean);
            return { ...rest, services: serviceIds };
        });
        const insertedSpecialists = await this.specialistModel.insertMany(specialistsToInsert);
        const serviceSpecialistsMap = new Map();
        for (let i = 0; i < seed_data_1.specialistsData.length; i++) {
            const specialistData = seed_data_1.specialistsData[i];
            const insertedSpecialist = insertedSpecialists[i];
            for (const serviceSlug of specialistData.servicesSlugs) {
                if (!serviceSpecialistsMap.has(serviceSlug)) {
                    serviceSpecialistsMap.set(serviceSlug, []);
                }
                serviceSpecialistsMap.get(serviceSlug).push(insertedSpecialist._id);
            }
        }
        const updatePromises = Array.from(serviceSpecialistsMap.entries()).map(([slug, specialistIds]) => this.serviceModel.updateOne({ slug }, { $set: { specialists: specialistIds } }));
        await Promise.all(updatePromises);
        return {
            message: 'Base de datos sembrada exitosamente',
            services: insertedServices.length,
            specialists: insertedSpecialists.length,
        };
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __param(1, (0, mongoose_1.InjectModel)(specialist_schema_1.Specialist.name)),
    __param(2, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(3, (0, mongoose_1.InjectModel)(contact_schema_1.Contact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SeedService);
//# sourceMappingURL=seed.service.js.map