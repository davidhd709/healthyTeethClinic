"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const service_schema_1 = require("../services/schemas/service.schema");
const specialist_schema_1 = require("../specialists/schemas/specialist.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const contact_schema_1 = require("../contact/schemas/contact.schema");
const seed_service_1 = require("./seed.service");
const seed_controller_1 = require("./seed.controller");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: service_schema_1.Service.name, schema: service_schema_1.ServiceSchema },
                { name: specialist_schema_1.Specialist.name, schema: specialist_schema_1.SpecialistSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: contact_schema_1.Contact.name, schema: contact_schema_1.ContactSchema },
            ]),
        ],
        controllers: [seed_controller_1.SeedController],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map