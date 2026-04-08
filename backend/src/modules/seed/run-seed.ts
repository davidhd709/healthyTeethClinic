import * as mongoose from 'mongoose';
import { ServiceSchema } from '../services/schemas/service.schema';
import { SpecialistSchema } from '../specialists/schemas/specialist.schema';
import { AppointmentSchema } from '../appointments/schemas/appointment.schema';
import { ContactSchema } from '../contact/schemas/contact.schema';
import { servicesData, specialistsData } from './seed.data';

async function runSeed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-teeth';

  console.log('Conectando a MongoDB...');
  await mongoose.connect(uri);
  console.log('Conectado a MongoDB');

  const ServiceModel = mongoose.model('Service', ServiceSchema);
  const SpecialistModel = mongoose.model('Specialist', SpecialistSchema);
  const AppointmentModel = mongoose.model('Appointment', AppointmentSchema);
  const ContactModel = mongoose.model('Contact', ContactSchema);

  // 1. Delete all existing documents
  console.log('Eliminando datos existentes...');
  await Promise.all([
    ServiceModel.deleteMany({}),
    SpecialistModel.deleteMany({}),
    AppointmentModel.deleteMany({}),
    ContactModel.deleteMany({}),
  ]);

  // 2. Insert services
  console.log('Insertando servicios...');
  const insertedServices = await ServiceModel.insertMany(servicesData);

  // Build slug-to-id map
  const serviceSlugMap = new Map<string, any>();
  for (const service of insertedServices) {
    serviceSlugMap.set((service as any).slug, service._id);
  }

  // 3. Insert specialists with resolved service IDs
  console.log('Insertando especialistas...');
  const specialistsToInsert = specialistsData.map((specialist) => {
    const { servicesSlugs, ...rest } = specialist;
    const serviceIds = servicesSlugs
      .map((slug) => serviceSlugMap.get(slug))
      .filter(Boolean);
    return { ...rest, services: serviceIds };
  });

  const insertedSpecialists = await SpecialistModel.insertMany(specialistsToInsert);

  // 4. Update services with specialist references
  console.log('Actualizando referencias de especialistas en servicios...');
  const serviceSpecialistsMap = new Map<string, any[]>();

  for (let i = 0; i < specialistsData.length; i++) {
    const specialistData = specialistsData[i];
    const insertedSpecialist = insertedSpecialists[i];

    for (const serviceSlug of specialistData.servicesSlugs) {
      if (!serviceSpecialistsMap.has(serviceSlug)) {
        serviceSpecialistsMap.set(serviceSlug, []);
      }
      serviceSpecialistsMap.get(serviceSlug)!.push(insertedSpecialist._id);
    }
  }

  const updatePromises = Array.from(serviceSpecialistsMap.entries()).map(
    ([slug, specialistIds]) =>
      ServiceModel.updateOne({ slug }, { $set: { specialists: specialistIds } }),
  );
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
