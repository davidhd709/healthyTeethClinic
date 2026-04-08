import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const specialistId = searchParams.get('specialistId');
    const serviceId = searchParams.get('serviceId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build filter object
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }
    if (specialistId) {
      filter.specialistId = specialistId;
    }
    if (serviceId) {
      filter.serviceId = serviceId;
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        (filter.date as Record<string, Date>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (filter.date as Record<string, Date>).$lte = new Date(dateTo);
      }
    }

    const appointments = await Appointment.find(filter)
      .populate('serviceId', 'name slug durationMinutes basePrice')
      .populate('specialistId', 'name slug photo specialty')
      .sort({ date: -1, time: -1 });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Check for double booking on the same specialist + date + time
    const existing = await Appointment.findOne({
      specialistId: body.specialistId,
      date: body.date,
      time: body.time,
      status: { $nin: ['cancelada'] },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'El especialista ya tiene una cita en esa fecha y hora' },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create(body);

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);

    // Handle MongoDB duplicate key error from the unique index
    if (error instanceof Error && 'code' in error && (error as { code: number }).code === 11000) {
      return NextResponse.json(
        { error: 'El especialista ya tiene una cita en esa fecha y hora' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear la cita' },
      { status: 500 }
    );
  }
}
