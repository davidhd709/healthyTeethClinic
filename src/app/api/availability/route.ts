import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Specialist from '@/models/Specialist';
import Appointment from '@/models/Appointment';

// Map JS getDay() (0=Sun) to the Spanish day names used in weeklySchedule
const dayIndexToName: Record<number, string> = {
  0: 'domingo',
  1: 'lunes',
  2: 'martes',
  3: 'miercoles',
  4: 'jueves',
  5: 'viernes',
  6: 'sabado',
};

/**
 * Convert "HH:MM" string to total minutes since midnight.
 */
function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert total minutes since midnight to "HH:MM" string.
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = request.nextUrl;
    const specialistId = searchParams.get('specialistId');
    const dateStr = searchParams.get('date');

    if (!specialistId || !dateStr) {
      return NextResponse.json(
        { error: 'Se requieren los parámetros specialistId y date' },
        { status: 400 }
      );
    }

    // Find the specialist
    const specialist = await Specialist.findById(specialistId);
    if (!specialist) {
      return NextResponse.json(
        { error: 'Especialista no encontrado' },
        { status: 404 }
      );
    }

    // Determine the day of the week for the requested date
    const requestedDate = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = requestedDate.getUTCDay();
    const dayName = dayIndexToName[dayOfWeek];

    // Find the specialist's schedule for that day
    const daySchedule = specialist.weeklySchedule.find(
      (s) => s.day === dayName
    );

    if (!daySchedule) {
      return NextResponse.json({
        specialistId,
        date: dateStr,
        dayName,
        slots: [],
        message: 'El especialista no trabaja este día',
      });
    }

    // Generate all possible time slots
    const startMinutes = timeToMinutes(daySchedule.startTime);
    const endMinutes = timeToMinutes(daySchedule.endTime);
    const blockDuration = daySchedule.blockDuration;

    // Pre-compute break ranges in minutes
    const breaks = (daySchedule.breaks || []).map((b) => ({
      start: timeToMinutes(b.start),
      end: timeToMinutes(b.end),
    }));

    const allSlots: string[] = [];
    for (let t = startMinutes; t + blockDuration <= endMinutes; t += blockDuration) {
      // Check if this slot overlaps with any break
      const slotEnd = t + blockDuration;
      const inBreak = breaks.some(
        (br) => t < br.end && slotEnd > br.start
      );
      if (!inBreak) {
        allSlots.push(minutesToTime(t));
      }
    }

    // Find booked appointments for this specialist on this date
    const startOfDay = new Date(dateStr + 'T00:00:00.000Z');
    const endOfDay = new Date(dateStr + 'T23:59:59.999Z');

    const bookedAppointments = await Appointment.find({
      specialistId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ['cancelada'] },
    }).select('time');

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

    // Build final response with availability status
    const slots = allSlots.map((time) => ({
      time,
      available: !bookedTimes.has(time),
    }));

    return NextResponse.json({
      specialistId,
      date: dateStr,
      dayName,
      blockDuration,
      slots,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Error al obtener la disponibilidad' },
      { status: 500 }
    );
  }
}
