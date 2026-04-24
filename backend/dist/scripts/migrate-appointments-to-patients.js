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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const mongoose = __importStar(require("mongoose"));
const appointment_schema_1 = require("../modules/appointments/schemas/appointment.schema");
const patient_schema_1 = require("../modules/patients/schemas/patient.schema");
function loadEnvIfPresent() {
    const envPath = path.resolve(process.cwd(), '.env');
    if (!fs.existsSync(envPath))
        return;
    try {
        const dotenv = require('dotenv');
        dotenv.config({ path: envPath });
    }
    catch {
    }
}
function splitName(fullName) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1)
        return { firstName: parts[0], lastName: parts[0] };
    const firstName = parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
    const lastName = parts.slice(Math.ceil(parts.length / 2)).join(' ');
    return { firstName, lastName };
}
async function run() {
    loadEnvIfPresent();
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('Falta MONGODB_URI en el entorno');
        process.exit(1);
    }
    console.log('Conectando a MongoDB...');
    await mongoose.connect(uri);
    const Appointment = mongoose.model('Appointment', appointment_schema_1.AppointmentSchema);
    const Patient = mongoose.model('Patient', patient_schema_1.PatientSchema);
    const appointments = await Appointment.find({
        $or: [{ patientId: { $exists: false } }, { patientId: null }],
    }).exec();
    console.log(`Citas sin patientId: ${appointments.length}`);
    let linked = 0;
    let created = 0;
    let skipped = 0;
    for (const appt of appointments) {
        const docNumber = appt.patientDocument;
        if (!docNumber || !docNumber.trim()) {
            skipped++;
            continue;
        }
        const trimmed = docNumber.trim();
        let patient = await Patient.findOne({ documentNumber: trimmed }).exec();
        if (!patient) {
            const apptSnapshot = appt;
            const { firstName, lastName } = splitName(apptSnapshot.patientName ?? 'Paciente');
            patient = await Patient.create({
                documentType: 'CC',
                documentNumber: trimmed,
                firstName,
                lastName,
                birthDate: new Date('1900-01-01T00:00:00.000Z'),
                sex: 'O',
                phone: apptSnapshot.patientPhone ?? '0000000',
                email: apptSnapshot.patientEmail?.toLowerCase().trim(),
                medicalInfo: { allergies: [], diseases: [], medications: [] },
                isActive: true,
                observations: 'Paciente creado automáticamente durante la migración de citas existentes.',
            });
            created++;
        }
        await Appointment.updateOne({ _id: appt._id }, { $set: { patientId: patient._id } });
        linked++;
    }
    console.log(`Citas vinculadas: ${linked}`);
    console.log(`Pacientes creados desde citas: ${created}`);
    console.log(`Citas sin documento (no procesadas): ${skipped}`);
    await mongoose.disconnect();
}
run().catch(async (err) => {
    console.error('Error en la migración:', err);
    try {
        await mongoose.disconnect();
    }
    catch {
    }
    process.exit(1);
});
//# sourceMappingURL=migrate-appointments-to-patients.js.map