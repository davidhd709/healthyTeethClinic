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
const user_schema_1 = require("../modules/users/schemas/user.schema");
const password_util_1 = require("../common/utils/password.util");
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
async function run() {
    loadEnvIfPresent();
    const uri = process.env.MONGODB_URI;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!uri) {
        console.error('Falta MONGODB_URI en el entorno');
        process.exit(1);
    }
    if (!adminEmail || !adminPassword) {
        console.error('Faltan ADMIN_EMAIL / ADMIN_PASSWORD en el entorno');
        process.exit(1);
    }
    console.log('Conectando a MongoDB...');
    await mongoose.connect(uri);
    const UserModel = mongoose.model('User', user_schema_1.UserSchema);
    const normalizedEmail = adminEmail.toLowerCase().trim();
    const existing = await UserModel.findOne({ email: normalizedEmail }).exec();
    if (existing) {
        console.log(`Usuario admin "${normalizedEmail}" ya existe. No se realizan cambios.`);
        await mongoose.disconnect();
        return;
    }
    const passwordHash = await (0, password_util_1.hashPassword)(adminPassword);
    await UserModel.create({
        email: normalizedEmail,
        passwordHash,
        name: 'Administrador',
        role: 'admin',
        isActive: true,
    });
    console.log(`Usuario admin "${normalizedEmail}" creado en colección users.`);
    console.log('Nota: el admin del .env sigue funcionando como fallback.');
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
//# sourceMappingURL=migrate-admin-user.js.map