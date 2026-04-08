import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Specialist from '@/models/Specialist';

export async function GET() {
  try {
    await connectDB();

    const specialists = await Specialist.find({ isActive: true })
      .populate('services', 'name slug icon durationMinutes basePrice')
      .sort({ name: 1 });

    return NextResponse.json(specialists);
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return NextResponse.json(
      { error: 'Error al obtener los especialistas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const specialist = await Specialist.create(body);

    return NextResponse.json(specialist, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating specialist:', error);
    const isValidation = error instanceof Error && error.name === 'ValidationError';
    return NextResponse.json(
      { error: isValidation ? (error as Error).message : 'Error al crear el especialista' },
      { status: isValidation ? 400 : 500 }
    );
  }
}
