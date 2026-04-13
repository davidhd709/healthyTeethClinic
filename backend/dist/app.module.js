"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const services_module_1 = require("./modules/services/services.module");
const specialists_module_1 = require("./modules/specialists/specialists.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const availability_module_1 = require("./modules/availability/availability.module");
const contact_module_1 = require("./modules/contact/contact.module");
const seed_module_1 = require("./modules/seed/seed.module");
const bot_module_1 = require("./modules/bot/bot.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            services_module_1.ServicesModule,
            specialists_module_1.SpecialistsModule,
            appointments_module_1.AppointmentsModule,
            availability_module_1.AvailabilityModule,
            contact_module_1.ContactModule,
            seed_module_1.SeedModule,
            bot_module_1.BotModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map