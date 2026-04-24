import * as fs from 'fs';
import * as path from 'path';
import * as mongoose from 'mongoose';
import { UserSchema } from '../modules/users/schemas/user.schema';
import { hashPassword } from '../common/utils/password.util';

function loadEnvIfPresent() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    const dotenv = require('dotenv');
    dotenv.config({ path: envPath });
  } catch {
    /* dotenv not installed — assume env vars are exported */
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

  const UserModel = mongoose.model('User', UserSchema);
  const normalizedEmail = adminEmail.toLowerCase().trim();

  const existing = await UserModel.findOne({ email: normalizedEmail }).exec();
  if (existing) {
    console.log(`Usuario admin "${normalizedEmail}" ya existe. No se realizan cambios.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await hashPassword(adminPassword);
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
  } catch {
    /* ignore */
  }
  process.exit(1);
});
