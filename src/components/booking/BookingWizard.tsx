'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { es } from 'date-fns/locale';
import { addDays, isBefore, startOfDay, isSunday } from 'date-fns';
import { toast } from 'sonner';
import {
  Search,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Check,
  CalendarDays,
  User,
  Stethoscope,
  ClipboardList,
  Sparkles,
  Loader2,
  ArrowLeft,
  Users,
} from 'lucide-react';

import type { IService, ISpecialist, TimeSlot } from '@/types';
import {
  appointmentSchema,
  type AppointmentFormData,
} from '@/lib/validations';
import { getDayName, formatDate, toDateString } from '@/lib/date-utils';
import { DAYS_MAP, CLINIC_NAME } from '@/lib/constants';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = [
  { id: 1, label: 'Servicio', icon: Stethoscope },
  { id: 2, label: 'Especialista', icon: Users },
  { id: 3, label: 'Fecha y Hora', icon: CalendarDays },
  { id: 4, label: 'Datos', icon: User },
  { id: 5, label: 'Confirmar', icon: ClipboardList },
] as const;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Sparkles,
  Clock,
};

// ---------------------------------------------------------------------------
// Step Indicator
// ---------------------------------------------------------------------------

function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: Set<number>;
}) {
  return (
    <nav aria-label="Progreso" className="mb-10">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.has(step.id);
          const StepIcon = step.icon;

          return (
            <li key={step.id} className="flex items-center">
              {/* Connector line before (not for first) */}
              {idx > 0 && (
                <div
                  className={`hidden h-0.5 w-8 sm:block md:w-14 transition-colors duration-300 ${
                    isCompleted || isActive ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}

              {/* Step circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`relative flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : isCompleted
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground'
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    <StepIcon className="size-4" />
                  )}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block transition-colors duration-300 ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Service Cards (Step 1)
// ---------------------------------------------------------------------------

function ServiceStep({
  services,
  loading,
  selectedId,
  onSelect,
}: {
  services: IService[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (s: IService) => void;
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q));
  }, [services, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-full rounded-md" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          No se encontraron servicios con &ldquo;{search}&rdquo;
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((service) => {
            const isSelected = selectedId === service._id;
            return (
              <button
                key={service._id}
                type="button"
                onClick={() => onSelect(service)}
                className={`group relative rounded-xl border-2 bg-card p-5 text-left transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-primary ring-2 ring-primary/20 shadow-md'
                    : 'border-border hover:border-primary/40'
                }`}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                    }`}
                  >
                    <Stethoscope className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-tight">
                      {service.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {service.durationMinutes} min
                      </span>
                      {service.basePrice != null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3.5" />
                          {service.basePrice.toLocaleString('es-CO')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Specialist Cards (Step 2)
// ---------------------------------------------------------------------------

function SpecialistStep({
  specialists,
  loading,
  selectedId,
  onSelect,
}: {
  specialists: ISpecialist[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (s: ISpecialist | null) => void;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[140px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (specialists.length === 0) {
    return (
      <div className="py-12 text-center">
        <Users className="mx-auto mb-3 size-12 text-muted-foreground/50" />
        <p className="text-muted-foreground">
          No hay especialistas disponibles para este servicio.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {specialists.map((specialist) => {
        const isSelected = selectedId === specialist._id;
        return (
          <button
            key={specialist._id}
            type="button"
            onClick={() => onSelect(specialist)}
            className={`group relative rounded-xl border-2 bg-card p-5 text-left transition-all duration-200 hover:shadow-md ${
              isSelected
                ? 'border-primary ring-2 ring-primary/20 shadow-md'
                : 'border-border hover:border-primary/40'
            }`}
          >
            {isSelected && (
              <div className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3.5" strokeWidth={3} />
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div
                className={`flex size-14 shrink-0 items-center justify-center rounded-full transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                }`}
              >
                <User className="size-6" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-tight">
                  {specialist.name}
                </h3>
                <Badge variant="secondary" className="mt-1.5">
                  {specialist.specialty}
                </Badge>
                {specialist.subspecialty && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {specialist.subspecialty}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  {specialist.experience} a&ntilde;os de experiencia
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Date & Time (Step 3)
// ---------------------------------------------------------------------------

function DateTimeStep({
  specialist,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: {
  specialist: ISpecialist;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onDateSelect: (d: Date | undefined) => void;
  onTimeSelect: (t: string) => void;
}) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Days the specialist works
  const workDays = useMemo(
    () => new Set<string>(specialist.weeklySchedule.map((s) => s.day)),
    [specialist.weeklySchedule]
  );

  // Determine disabled calendar days
  const disabledMatcher = useCallback(
    (date: Date) => {
      // Past dates
      if (isBefore(date, startOfDay(new Date()))) return true;
      // Sundays
      if (isSunday(date)) return true;
      // Days the specialist doesn't work
      const dayName = getDayName(date);
      if (!dayName || !workDays.has(dayName)) return true;
      return false;
    },
    [workDays]
  );

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    let cancelled = false;
    const dateStr = toDateString(selectedDate);

    async function fetchSlots() {
      setLoadingSlots(true);
      try {
        const res = await fetch(
          `/api/availability?specialistId=${specialist._id}&date=${dateStr}`
        );
        if (!res.ok) throw new Error('Error al obtener disponibilidad');
        const data = await res.json();
        if (!cancelled) {
          setSlots(data.slots ?? []);
        }
      } catch {
        if (!cancelled) {
          toast.error('No se pudo cargar la disponibilidad. Intente de nuevo.');
          setSlots([]);
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    }

    fetchSlots();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, specialist._id]);

  const availableSlots = slots.filter((s) => s.available);
  const unavailableSlots = slots.filter((s) => !s.available);

  return (
    <div className="space-y-8">
      {/* Calendar */}
      <div className="flex justify-center">
        <Card className="inline-block">
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={disabledMatcher}
              locale={es}
              fromDate={new Date()}
              toDate={addDays(new Date(), 90)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected date label */}
      {selectedDate && (
        <div className="text-center">
          <Badge variant="outline" className="px-3 py-1 text-sm">
            <CalendarDays className="mr-1.5 size-3.5" />
            {formatDate(selectedDate)}
          </Badge>
        </div>
      )}

      {/* Time slots */}
      {selectedDate && (
        <div className="space-y-4">
          <h4 className="text-center text-sm font-medium text-muted-foreground">
            Horarios disponibles
          </h4>

          {loadingSlots ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              No hay horarios configurados para este d&iacute;a.
            </p>
          ) : availableSlots.length === 0 ? (
            <p className="py-6 text-center text-muted-foreground">
              Todos los horarios est&aacute;n ocupados para esta fecha. Por
              favor, seleccione otro d&iacute;a.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => onTimeSelect(slot.time)}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      !slot.available
                        ? 'cursor-not-allowed border-border bg-muted/50 text-muted-foreground/40 line-through'
                        : isSelected
                          ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                          : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}

          {/* Legend */}
          {slots.length > 0 && (
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded border border-border bg-card" />
                Disponible ({availableSlots.length})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block size-3 rounded border border-border bg-muted/50" />
                Ocupado ({unavailableSlots.length})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Patient Form (Step 4)
// ---------------------------------------------------------------------------

function PatientStep({
  form,
}: {
  form: ReturnType<typeof useForm<AppointmentFormData>>;
}) {
  return (
    <div className="space-y-6">
      <Form {...form}>
        <div className="space-y-5">
          {/* Name */}
          <FormField
            control={form.control}
            name="patientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Maria Garcia Lopez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email & Phone - side by side on larger screens */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="patientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electr&oacute;nico *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="patientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tel&eacute;fono *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Ej: 300 555 0123"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Document (optional) */}
          <FormField
            control={form.control}
            name="patientDocument"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Documento de identidad{' '}
                  <span className="font-normal text-muted-foreground">
                    (opcional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reason for visit */}
          <FormField
            control={form.control}
            name="reasonForVisit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motivo de la consulta *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describa brevemente el motivo de su visita, sintomas o tratamiento deseado..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Data consent */}
          <FormField
            control={form.control}
            name="dataConsent"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-border accent-primary"
                    />
                  </FormControl>
                  <div className="space-y-1">
                    <Label
                      className="cursor-pointer text-sm leading-relaxed"
                      onClick={() => field.onChange(!field.value)}
                    >
                      Acepto el tratamiento de mis datos personales conforme a
                      la pol&iacute;tica de privacidad de {CLINIC_NAME}. *
                    </Label>
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </div>
      </Form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirmation Summary (Step 5)
// ---------------------------------------------------------------------------

function ConfirmationStep({
  service,
  specialist,
  date,
  time,
  formData,
}: {
  service: IService;
  specialist: ISpecialist;
  date: Date;
  time: string;
  formData: Partial<AppointmentFormData>;
}) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Service & Specialist */}
          <div className="space-y-4 p-6">
            <h4 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Resumen de tu cita
            </h4>

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Servicio</p>
                <p className="font-semibold">{service.name}</p>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {service.durationMinutes} min
                  </span>
                  {service.basePrice != null && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3.5" />
                      {service.basePrice.toLocaleString('es-CO')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Especialista</p>
                <p className="font-semibold">{specialist.name}</p>
                <p className="text-sm text-muted-foreground">
                  {specialist.specialty}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha y hora</p>
                <p className="font-semibold capitalize">
                  {formatDate(date)}
                </p>
                <p className="text-sm font-medium text-primary">{time}</p>
              </div>
            </div>
          </div>

          {/* Patient info */}
          <div className="border-t bg-muted/30 p-6">
            <h4 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Datos del paciente
            </h4>
            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Nombre</dt>
                <dd className="font-medium">
                  {formData.patientName}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Correo</dt>
                <dd className="font-medium">
                  {formData.patientEmail}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tel&eacute;fono</dt>
                <dd className="font-medium">
                  {formData.patientPhone}
                </dd>
              </div>
              {formData.patientDocument && (
                <div>
                  <dt className="text-muted-foreground">Documento</dt>
                  <dd className="font-medium">
                    {formData.patientDocument}
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Motivo</dt>
                <dd className="font-medium">
                  {formData.reasonForVisit}
                </dd>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success Screen
// ---------------------------------------------------------------------------

function SuccessScreen({
  service,
  specialist,
  date,
  time,
  patientName,
}: {
  service: IService;
  specialist: ISpecialist;
  date: Date;
  time: string;
  patientName: string;
}) {
  return (
    <div className="py-8 text-center">
      {/* Celebration visual */}
      <div className="relative mx-auto mb-6 flex size-24 items-center justify-center">
        {/* Animated rings */}
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-2 animate-pulse rounded-full bg-primary/10" />
        <div className="relative flex size-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Check className="size-10" strokeWidth={3} />
        </div>
        {/* Confetti-like decorative dots */}
        <span className="absolute -left-2 -top-1 size-2.5 animate-bounce rounded-full bg-amber-400" />
        <span className="absolute -right-1 top-2 size-2 animate-bounce rounded-full bg-sky-400 [animation-delay:150ms]" />
        <span className="absolute -bottom-1 left-1 size-2 animate-bounce rounded-full bg-rose-400 [animation-delay:300ms]" />
        <span className="absolute -right-3 bottom-3 size-1.5 animate-bounce rounded-full bg-emerald-400 [animation-delay:200ms]" />
        <span className="absolute -left-3 top-8 size-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:100ms]" />
      </div>

      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        &iexcl;Cita Agendada Exitosamente!
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted-foreground">
        Hola <span className="font-medium text-foreground">{patientName}</span>,
        tu cita ha sido registrada. Te enviaremos un correo de
        confirmaci&oacute;n con los detalles.
      </p>

      {/* Appointment summary card */}
      <Card className="mx-auto mt-8 max-w-sm text-left">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-3">
            <Stethoscope className="size-4 text-primary" />
            <span className="text-sm">
              <span className="text-muted-foreground">Servicio:</span>{' '}
              <span className="font-medium">{service.name}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <User className="size-4 text-primary" />
            <span className="text-sm">
              <span className="text-muted-foreground">Especialista:</span>{' '}
              <span className="font-medium">{specialist.name}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm">
              <span className="text-muted-foreground">Fecha:</span>{' '}
              <span className="font-medium capitalize">
                {formatDate(date)}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-4 text-primary" />
            <span className="text-sm">
              <span className="text-muted-foreground">Hora:</span>{' '}
              <span className="font-medium">{time}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button asChild size="lg" className="gap-2">
          <a href="/">
            <ArrowLeft className="size-4" />
            Volver al Inicio
          </a>
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main BookingWizard
// ---------------------------------------------------------------------------

export default function BookingWizard() {
  const searchParams = useSearchParams();

  // ---- Data State ----
  const [services, setServices] = useState<IService[]>([]);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSpecialists, setLoadingSpecialists] = useState(true);

  // ---- Wizard State ----
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [selectedService, setSelectedService] = useState<IService | null>(
    null
  );
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<ISpecialist | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ---- Form ----
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      patientDocument: '',
      serviceId: '',
      specialistId: '',
      date: '',
      time: '',
      reasonForVisit: '',
      dataConsent: false,
    },
  });

  // Keep form in sync with wizard selections
  useEffect(() => {
    if (selectedService) form.setValue('serviceId', selectedService._id);
  }, [selectedService, form]);

  useEffect(() => {
    if (selectedSpecialist)
      form.setValue('specialistId', selectedSpecialist._id);
  }, [selectedSpecialist, form]);

  useEffect(() => {
    if (selectedDate) form.setValue('date', toDateString(selectedDate));
  }, [selectedDate, form]);

  useEffect(() => {
    if (selectedTime) form.setValue('time', selectedTime);
  }, [selectedTime, form]);

  // ---- Fetch Services & Specialists ----
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setServices(Array.isArray(data) ? data : data.services ?? []);
      } catch {
        toast.error('Error al cargar los servicios.');
      } finally {
        setLoadingServices(false);
      }
    }

    async function fetchSpecialists() {
      try {
        const res = await fetch('/api/specialists');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSpecialists(
          Array.isArray(data) ? data : data.specialists ?? []
        );
      } catch {
        toast.error('Error al cargar los especialistas.');
      } finally {
        setLoadingSpecialists(false);
      }
    }

    fetchServices();
    fetchSpecialists();
  }, []);

  // ---- Pre-select from URL search params ----
  useEffect(() => {
    if (loadingServices || loadingSpecialists) return;

    const serviceSlug = searchParams.get('servicio');
    const specialistSlug = searchParams.get('especialista');

    if (serviceSlug && !selectedService) {
      const match = services.find((s) => s.slug === serviceSlug);
      if (match) {
        setSelectedService(match);
        // If service is pre-selected, advance to step 2
        setCompletedSteps((prev) => new Set([...prev, 1]));
        setCurrentStep(2);
      }
    }

    if (specialistSlug && !selectedSpecialist) {
      const match = specialists.find((s) => s.slug === specialistSlug);
      if (match) {
        setSelectedSpecialist(match);
      }
    }
  }, [
    loadingServices,
    loadingSpecialists,
    services,
    specialists,
    searchParams,
    selectedService,
    selectedSpecialist,
  ]);

  // ---- Filtered specialists for selected service ----
  const filteredSpecialists = useMemo(() => {
    if (!selectedService) return [];
    return specialists.filter((sp) => {
      // services on specialist could be string IDs or populated objects
      return sp.services.some((svc: string | IService) => {
        const id = typeof svc === 'string' ? svc : (svc as IService)._id;
        return id === selectedService._id;
      });
    });
  }, [selectedService, specialists]);

  // ---- Step validation ----
  const isStepValid = useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return selectedService !== null;
        case 2:
          return selectedSpecialist !== null;
        case 3:
          return selectedDate !== undefined && selectedTime !== null;
        case 4: {
          const values = form.getValues();
          return (
            values.patientName.length >= 3 &&
            values.patientEmail.includes('@') &&
            values.patientPhone.length >= 7 &&
            values.reasonForVisit.length >= 10 &&
            values.dataConsent === true
          );
        }
        case 5:
          return true;
        default:
          return false;
      }
    },
    [selectedService, selectedSpecialist, selectedDate, selectedTime, form]
  );

  // ---- Navigation ----
  const goNext = useCallback(async () => {
    // Validate step 4 with full form validation
    if (currentStep === 4) {
      const valid = await form.trigger();
      if (!valid) return;
    }

    if (!isStepValid(currentStep)) return;

    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  }, [currentStep, isStepValid, form]);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // ---- Service selection handler ----
  const handleServiceSelect = useCallback((service: IService) => {
    setSelectedService(service);
    // Reset downstream selections when service changes
    setSelectedSpecialist(null);
    setSelectedDate(undefined);
    setSelectedTime(null);
  }, []);

  // ---- Specialist selection handler ----
  const handleSpecialistSelect = useCallback(
    (specialist: ISpecialist | null) => {
      setSelectedSpecialist(specialist);
      // Reset downstream selections when specialist changes
      setSelectedDate(undefined);
      setSelectedTime(null);
    },
    []
  );

  // ---- Date selection handler ----
  const handleDateSelect = useCallback((date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  }, []);

  // ---- Submit ----
  const handleSubmit = useCallback(async () => {
    if (!selectedService || !selectedSpecialist || !selectedDate || !selectedTime)
      return;

    setIsSubmitting(true);
    try {
      const values = form.getValues();
      const payload: AppointmentFormData = {
        ...values,
        serviceId: selectedService._id,
        specialistId: selectedSpecialist._id,
        date: toDateString(selectedDate),
        time: selectedTime,
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 409) {
        toast.error(
          'Este horario acaba de ser reservado por otro paciente. Por favor, seleccione otro horario.',
          { duration: 5000 }
        );
        // Go back to date/time step
        setCurrentStep(3);
        setSelectedTime(null);
        setCompletedSteps((prev) => {
          const next = new Set(prev);
          next.delete(3);
          next.delete(4);
          next.delete(5);
          return next;
        });
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Error al agendar la cita');
      }

      setIsSuccess(true);
      toast.success('Cita agendada exitosamente.');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Error al agendar la cita. Intente nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedService, selectedSpecialist, selectedDate, selectedTime, form]);

  // ---- Step titles & subtitles ----
  const stepMeta: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: 'Selecciona un Servicio',
      subtitle:
        'Elige el tratamiento o consulta que necesitas.',
    },
    2: {
      title: 'Elige tu Especialista',
      subtitle:
        'Selecciona el profesional que te atendera.',
    },
    3: {
      title: 'Fecha y Horario',
      subtitle:
        'Elige el dia y la hora que mejor se ajuste a tu agenda.',
    },
    4: {
      title: 'Tus Datos',
      subtitle:
        'Completa tu informacion para confirmar la cita.',
    },
    5: {
      title: 'Confirma tu Cita',
      subtitle:
        'Revisa los detalles y confirma tu reserva.',
    },
  };

  // ---- Success state ----
  if (isSuccess && selectedService && selectedSpecialist && selectedDate && selectedTime) {
    return (
      <SuccessScreen
        service={selectedService}
        specialist={selectedSpecialist}
        date={selectedDate}
        time={selectedTime}
        patientName={form.getValues('patientName')}
      />
    );
  }

  // ---- Render ----
  const meta = stepMeta[currentStep];
  const canGoNext = isStepValid(currentStep);

  return (
    <div>
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Step Title */}
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{meta.subtitle}</p>
      </div>

      {/* Step Content */}
      <div className="min-h-[320px]">
        {currentStep === 1 && (
          <ServiceStep
            services={services}
            loading={loadingServices}
            selectedId={selectedService?._id ?? null}
            onSelect={handleServiceSelect}
          />
        )}

        {currentStep === 2 && (
          <SpecialistStep
            specialists={filteredSpecialists}
            loading={loadingSpecialists}
            selectedId={selectedSpecialist?._id ?? null}
            onSelect={handleSpecialistSelect}
          />
        )}

        {currentStep === 3 && selectedSpecialist && (
          <DateTimeStep
            specialist={selectedSpecialist}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onDateSelect={handleDateSelect}
            onTimeSelect={setSelectedTime}
          />
        )}

        {currentStep === 4 && <PatientStep form={form} />}

        {currentStep === 5 &&
          selectedService &&
          selectedSpecialist &&
          selectedDate &&
          selectedTime && (
            <ConfirmationStep
              service={selectedService}
              specialist={selectedSpecialist}
              date={selectedDate}
              time={selectedTime}
              formData={form.getValues()}
            />
          )}
      </div>

      {/* Navigation */}
      <div className="mt-10 flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={currentStep === 1}
          className="gap-1.5"
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={goNext}
            disabled={!canGoNext}
            className="gap-1.5"
          >
            Siguiente
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Agendando...
              </>
            ) : (
              <>
                <Check className="size-4" />
                Confirmar Cita
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
