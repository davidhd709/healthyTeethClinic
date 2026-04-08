import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';
import Specialist from '@/models/Specialist';
import Appointment from '@/models/Appointment';
import Contact from '@/models/Contact';
import { servicesData, specialistsData } from '@/lib/seed-data';

export async function POST() {
  try {
    await connectDB();

    // Clear all collections
    await Promise.all([
      Service.deleteMany({}),
      Specialist.deleteMany({}),
      Appointment.deleteMany({}),
      Contact.deleteMany({}),
    ]);

    // Seed services
    const createdServices = await Service.insertMany(servicesData);

    // Build a slug-to-ObjectId map for cross-referencing
    const slugToServiceId = new Map<string, typeof createdServices[0]['_id']>();
    for (const svc of createdServices) {
      slugToServiceId.set(svc.slug, svc._id);
    }

    // Seed specialists, resolving servicesSlugs to service ObjectIds
    const specialistsToInsert = specialistsData.map(({ servicesSlugs, ...rest }) => ({
      ...rest,
      services: servicesSlugs
        .map((slug) => slugToServiceId.get(slug))
        .filter(Boolean),
    }));

    const createdSpecialists = await Specialist.insertMany(specialistsToInsert);

    // Update each service with its specialist references
    const updatePromises = createdSpecialists.map((specialist) => {
      const serviceIds = specialist.services as typeof createdServices[0]['_id'][];
      return Service.updateMany(
        { _id: { $in: serviceIds } },
        { $addToSet: { specialists: specialist._id } }
      );
    });
    await Promise.all(updatePromises);

    return NextResponse.json({
      message: 'Base de datos sembrada exitosamente',
      services: createdServices.length,
      specialists: createdSpecialists.length,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Error al sembrar la base de datos' },
      { status: 500 }
    );
  }
}
