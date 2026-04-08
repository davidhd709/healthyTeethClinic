import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Specialist from '@/models/Specialist';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;
    const specialist = await Specialist.findById(id)
      .populate('services', 'name slug icon durationMinutes basePrice');

    if (!specialist) {
      return NextResponse.json(
        { error: 'Especialista no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(specialist);
  } catch (error) {
    console.error('Error fetching specialist:', error);
    return NextResponse.json(
      { error: 'Error al obtener el especialista' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;
    const body = await request.json();
    const specialist = await Specialist.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!specialist) {
      return NextResponse.json(
        { error: 'Especialista no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(specialist);
  } catch (error) {
    console.error('Error updating specialist:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el especialista' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { id } = await context.params;
    const specialist = await Specialist.findByIdAndDelete(id);

    if (!specialist) {
      return NextResponse.json(
        { error: 'Especialista no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Especialista eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting specialist:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el especialista' },
      { status: 500 }
    );
  }
}
