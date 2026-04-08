"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const service_schema_1 = require("../services/schemas/service.schema");
const specialist_schema_1 = require("../specialists/schemas/specialist.schema");
const appointment_schema_1 = require("../appointments/schemas/appointment.schema");
const contact_schema_1 = require("../contact/schemas/contact.schema");
const seed_data_1 = require("./seed.data");
async function runSeed() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-teeth';
    console.log('Conectando a MongoDB...');
    await mongoose.connect(uri);
    console.log('Conectado a MongoDB');
    const ServiceModel = mongoose.model('Service', service_schema_1.ServiceSchema);
    const SpecialistModel = mongoose.model('Specialist', specialist_schema_1.SpecialistSchema);
    const AppointmentModel = mongoose.model('Appointment', appointment_schema_1.AppointmentSchema);
    const ContactModel = mongoose.model('Contact', contact_schema_1.ContactSchema);
    console.log('Eliminando datos existentes...');
    await Promise.all([
        ServiceModel.deleteMany({}),
        SpecialistModel.deleteMany({}),
        AppointmentModel.deleteMany({}),
        ContactModel.deleteMany({}),
    ]);
    console.log('Insertando servicios...');
    const insertedServices = await ServiceModel.insertMany(seed_data_1.servicesData);
    const serviceSlugMap = new Map();
    for (const service of insertedServices) {
        serviceSlugMap.set(service.slug, service._id);
    }
    console.log('Insertando especialistas...');
    const specialistsToInsert = seed_data_1.specialistsData.map((specialist) => {
        const { servicesSlugs, ...rest } = specialist;
        const serviceIds = servicesSlugs
            .map((slug) => serviceSlugMap.get(slug))
            .filter(Boolean);
        return { ...rest, services: serviceIds };
    });
    const insertedSpecialists = await SpecialistModel.insertMany(specialistsToInsert);
    console.log('Actualizando referencias de especialistas en servicios...');
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
    const updatePromises = Array.from(serviceSpecialistsMap.entries()).map(([slug, specialistIds]) => ServiceModel.updateOne({ slug }, { $set: { specialists: specialistIds } }));
    await Promise.all(updatePromises);
    console.log(`Seed completado:`);
    console.log(`  - ${insertedServices.length} servicios insertados`);
    console.log(`  - ${insertedSpecialists.length} especialistas insertados`);
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
}
runSeed().catch((err) => {
    console.error('Error durante el seed:', err);
    process.exit(1);
});
//# sourceMappingURL=run-seed.js.map