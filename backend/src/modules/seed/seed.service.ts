import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Service,
  ServiceDocument,
} from '../services/schemas/service.schema';
import {
  Specialist,
  SpecialistDocument,
} from '../specialists/schemas/specialist.schema';
import {
  Appointment,
  AppointmentDocument,
} from '../appointments/schemas/appointment.schema';
import {
  Contact,
  ContactDocument,
} from '../contact/schemas/contact.schema';
import { servicesData, specialistsData } from './seed.data';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Service.name)
    private readonly serviceModel: Model<ServiceDocument>,
    @InjectModel(Specialist.name)
    private readonly specialistModel: Model<SpecialistDocument>,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Contact.name)
    private readonly contactModel: Model<ContactDocument>,
  ) {}

  async seed() {
    // 1. Delete all existing documents
    await Promise.all([
      this.serviceModel.deleteMany({}),
      this.specialistModel.deleteMany({}),
      this.appointmentModel.deleteMany({}),
      this.contactModel.deleteMany({}),
    ]);

    // 2. Insert services
    const insertedServices = await this.serviceModel.insertMany(servicesData);

    // Build a slug-to-id map for service resolution
    const serviceSlugMap = new Map<string, any>();
    for (const service of insertedServices) {
      serviceSlugMap.set(service.slug, service._id);
    }

    // 3. Insert specialists, resolving servicesSlugs to actual ObjectIds
    const specialistsToInsert = specialistsData.map((specialist) => {
      const { servicesSlugs, ...rest } = specialist;
      const serviceIds = servicesSlugs
        .map((slug) => serviceSlugMap.get(slug))
        .filter(Boolean);
      return { ...rest, services: serviceIds };
    });

    const insertedSpecialists =
      await this.specialistModel.insertMany(specialistsToInsert);

    // 4. Update services with their specialist references
    // Build a map of service slug -> specialist IDs
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

    // Update each service with its specialists
    const updatePromises = Array.from(serviceSpecialistsMap.entries()).map(
      ([slug, specialistIds]) =>
        this.serviceModel.updateOne(
          { slug },
          { $set: { specialists: specialistIds } },
        ),
    );
    await Promise.all(updatePromises);

    return {
      message: 'Base de datos sembrada exitosamente',
      services: insertedServices.length,
      specialists: insertedSpecialists.length,
    };
  }
}
