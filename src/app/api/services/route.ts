import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';

export async function GET() {
  try {
    await connectDB();

    const services = await Service.find({ isActive: true })
      .populate('specialists', 'name slug photo specialty')
      .sort({ name: 1 });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const service = await Service.create(body);

    return NextResponse.json(service, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating service:', error);
    const isValidation = error instanceof Error && error.name === 'ValidationError';
    return NextResponse.json(
      { error: isValidation ? (error as Error).message : 'Error al crear el servicio' },
      { status: isValidation ? 400 : 500 }
    );
  }
}
