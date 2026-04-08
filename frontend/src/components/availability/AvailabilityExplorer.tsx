'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { es } from 'date-fns/locale';
import {
  CalendarDays,
  Clock,
  Filter,
  Stethoscope,
  User,
  X,
  Briefcase,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/shared/EmptyState';
import { DAYS_MAP } from '@/lib/constants';
import { toDateString, formatDate } from '@/lib/date-utils';
import { apiUrl } from '@/lib/api';
import type { ISpecialist, IService, TimeSlot } from '@/types';

export default function AvailabilityExplorer() {
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [services, setServices] = useState<IService[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch specialists and services on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [specRes, servRes] = await Promise.all([
          fetch(apiUrl('/api/specialists')),
          fetch(apiUrl('/api/services')),
        ]);
        const specData = await specRes.json();
        const servData = await servRes.json();
        setSpecialists(Array.isArray(specData) ? specData : specData.data ?? []);
        setServices(Array.isArray(servData) ? servData : servData.data ?? []);
      } catch {
        // Silently handle; user will see empty state
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  // Derive unique specialties
  const specialties = useMemo(() => {
    const set = new Set(specialists.map((s) => s.specialty));
    return Array.from(set).sort();
  }, [specialists]);

  // Filter specialists by specialty and service
  const filteredSpecialists = useMemo(() => {
    let list = specialists;
    if (selectedSpecialty) {
      list = list.filter((s) => s.specialty === selectedSpecialty);
    }
    if (selectedServiceId) {
      list = list.filter((s) =>
        s.services.some((service) => {
          const serviceId = typeof service === 'string' ? service : service._id;
          return serviceId === selectedServiceId;
        }),
      );
    }
    return list;
  }, [specialists, selectedSpecialty, selectedServiceId]);

  const selectedSpecialist = useMemo(
    () => specialists.find((s) => s._id === selectedSpecialistId),
    [specialists, selectedSpecialistId]
  );

  // Fetch slots when specialist + date are selected
  const fetchSlots = useCallback(async (specialistId: string, date: Date) => {
    setLoadingSlots(true);
    try {
      const dateStr = toDateString(date);
      const res = await fetch(
        apiUrl(`/api/availability?specialistId=${specialistId}&date=${dateStr}`)
      );
      const data = await res.json();
      setSlots(Array.isArray(data?.slots) ? data.slots : Array.isArray(data) ? data : []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSpecialistId && selectedDate) {
      fetchSlots(selectedSpecialistId, selectedDate);
    } else {
      setSlots([]);
    }
  }, [selectedSpecialistId, selectedDate, fetchSlots]);

  // Reset dependent filters
  function handleSpecialtyChange(value: string) {
    setSelectedSpecialty(value);
    setSelectedSpecialistId('');
    setSelectedDate(undefined);
    setSlots([]);
  }

  function handleServiceChange(value: string) {
    setSelectedServiceId(value);
    setSelectedSpecialistId('');
    setSelectedDate(undefined);
    setSlots([]);
  }

  function handleSpecialistChange(value: string) {
    setSelectedSpecialistId(value);
    setSelectedDate(undefined);
    setSlots([]);
  }

  function clearFilters() {
    setSelectedSpecialty('');
    setSelectedSpecialistId('');
    setSelectedServiceId('');
    setSelectedDate(undefined);
    setSlots([]);
  }

  const hasActiveFilters =
    selectedSpecialty || selectedSpecialistId || selectedServiceId || selectedDate;

  const availableSlots = slots.filter((s) => s.available);
  const occupiedSlots = slots.filter((s) => !s.available);
  const selectedServiceSlug =
    services.find((service) => service._id === selectedServiceId)?.slug ?? '';

  if (loadingData) {
    return <ExplorerSkeleton />;
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Filters Sidebar */}
      <aside className="w-full shrink-0 lg:w-80">
        <Card className="sticky top-24 rounded-xl border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="size-5 text-primary" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Specialty filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Stethoscope className="size-3.5 text-muted-foreground" />
                Especialidad
              </label>
              <Select
                value={selectedSpecialty}
                onValueChange={handleSpecialtyChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todas las especialidades" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Briefcase className="size-3.5 text-muted-foreground" />
                Servicio
              </label>
              <Select
                value={selectedServiceId}
                onValueChange={handleServiceChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos los servicios" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((svc) => (
                    <SelectItem key={svc._id} value={svc._id}>
                      {svc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialist filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <User className="size-3.5 text-muted-foreground" />
                Especialista
              </label>
              <Select
                value={selectedSpecialistId}
                onValueChange={handleSpecialistChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar especialista" />
                </SelectTrigger>
                <SelectContent>
                  {filteredSpecialists.map((spec) => (
                    <SelectItem key={spec._id} value={spec._id}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Calendar */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <CalendarDays className="size-3.5 text-muted-foreground" />
                Fecha
              </label>
              <div className="flex justify-center rounded-lg border border-border/60 p-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={es}
                  disabled={{ before: new Date() }}
                  className="rounded-md"
                />
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={clearFilters}
              >
                <X className="size-4" />
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1">
        {/* No specialist selected: show specialist cards */}
        {!selectedSpecialistId && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {filteredSpecialists.length === 0
                  ? 'No se encontraron especialistas'
                  : `${filteredSpecialists.length} especialista${filteredSpecialists.length !== 1 ? 's' : ''} disponible${filteredSpecialists.length !== 1 ? 's' : ''}`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona un especialista para consultar su disponibilidad horaria.
              </p>
            </div>

            {filteredSpecialists.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredSpecialists.map((spec) => (
                  <SpecialistOverviewCard
                    key={spec._id}
                    specialist={spec}
                    onSelect={() => handleSpecialistChange(spec._id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin resultados"
                description="No encontramos especialistas que coincidan con los filtros seleccionados. Intenta ajustar los criterios de busqueda."
              />
            )}
          </>
        )}

        {/* Specialist selected: show info + slots */}
        {selectedSpecialistId && selectedSpecialist && (
          <div className="space-y-6">
            {/* Specialist info card */}
            <Card className="overflow-hidden rounded-xl border-primary/20 shadow-sm">
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-8" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedSpecialist.name}
                  </h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{selectedSpecialist.specialty}</Badge>
                    {selectedSpecialist.subspecialty && (
                      <Badge variant="outline">{selectedSpecialist.subspecialty}</Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {selectedSpecialist.experience} anos de experiencia
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {selectedSpecialist.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setSelectedSpecialistId('');
                    setSelectedDate(undefined);
                    setSlots([]);
                  }}
                >
                  Cambiar especialista
                </Button>
              </CardContent>
            </Card>

            {/* Date prompt */}
            {!selectedDate && (
              <Card className="rounded-xl border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="size-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Selecciona una fecha
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Usa el calendario en el panel de filtros para consultar los
                    horarios disponibles de este especialista.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Slots grid */}
            {selectedDate && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Horarios para el {formatDate(selectedDate)}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {loadingSlots
                        ? 'Cargando disponibilidad...'
                        : `${availableSlots.length} horario${availableSlots.length !== 1 ? 's' : ''} disponible${availableSlots.length !== 1 ? 's' : ''}`}
                    </p>
                  </div>
                  {!loadingSlots && slots.length > 0 && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-3 rounded-full bg-emerald-500" />
                        Disponible
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="inline-block size-3 rounded-full bg-muted-foreground/30" />
                        Ocupado
                      </span>
                    </div>
                  )}
                </div>

                {loadingSlots ? (
                  <SlotsSkeleton />
                ) : slots.length === 0 ? (
                  <Card className="rounded-xl border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                        <Clock className="size-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Sin horarios disponibles
                      </h3>
                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        Este especialista no tiene horarios configurados para la
                        fecha seleccionada. Prueba con otro dia.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {slots.map((slot) => {
                      if (slot.available) {
                        const bookingParams = new URLSearchParams({
                          especialista: selectedSpecialist.slug,
                          fecha: toDateString(selectedDate),
                          hora: slot.time,
                        });

                        if (selectedServiceSlug) {
                          bookingParams.set('servicio', selectedServiceSlug);
                        }
                        if (selectedServiceId) {
                          bookingParams.set('servicioId', selectedServiceId);
                        }

                        return (
                          <Link
                            key={slot.time}
                            href={`/agendar?${bookingParams.toString()}`}
                            className="group"
                          >
                            <Card className="cursor-pointer rounded-xl border-emerald-200 bg-emerald-50/50 transition-all hover:border-emerald-400 hover:shadow-md dark:border-emerald-800 dark:bg-emerald-950/20 dark:hover:border-emerald-600">
                              <CardContent className="flex items-center justify-center gap-2 px-3 py-4">
                                <Clock className="size-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                                  {slot.time}
                                </span>
                                <ArrowRight className="size-3.5 text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100" />
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      }

                      return (
                        <Card
                          key={slot.time}
                          className="rounded-xl border-border/40 bg-muted/50 opacity-60"
                        >
                          <CardContent className="flex items-center justify-center gap-2 px-3 py-4">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground line-through">
                              {slot.time}
                            </span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Summary */}
                {!loadingSlots && slots.length > 0 && (
                  <div className="flex flex-wrap gap-4 rounded-xl bg-muted/40 p-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">Total:</span>
                      <span className="text-muted-foreground">{slots.length} horarios</span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2.5 rounded-full bg-emerald-500" />
                      <span className="text-muted-foreground">
                        {availableSlots.length} disponibles
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-5" />
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2.5 rounded-full bg-muted-foreground/30" />
                      <span className="text-muted-foreground">
                        {occupiedSlots.length} ocupados
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Specialist Overview Card                                           */
/* ------------------------------------------------------------------ */
function SpecialistOverviewCard({
  specialist,
  onSelect,
}: {
  specialist: ISpecialist;
  onSelect: () => void;
}) {
  return (
    <Card className="group cursor-pointer rounded-xl transition-all hover:border-primary/40 hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <User className="size-7" />
        </div>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-base leading-tight">{specialist.name}</CardTitle>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {specialist.specialty}
            </Badge>
            {specialist.subspecialty && (
              <Badge variant="outline" className="text-xs">
                {specialist.subspecialty}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {specialist.description}
        </p>

        {/* Weekly schedule overview */}
        {specialist.weeklySchedule.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Horario semanal
            </p>
            <div className="flex flex-wrap gap-1.5">
              {specialist.weeklySchedule.map((sched) => (
                <Badge
                  key={sched.day}
                  variant="outline"
                  className="gap-1 text-xs font-normal"
                >
                  <span className="font-medium">{DAYS_MAP[sched.day] ?? sched.day}</span>
                  <span className="text-muted-foreground">
                    {sched.startTime}-{sched.endTime}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            {specialist.experience} anos de experiencia
          </span>
          <Button size="sm" className="gap-1.5" onClick={onSelect}>
            Ver disponibilidad
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Skeleton Components                                                */
/* ------------------------------------------------------------------ */
function ExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <aside className="w-full lg:w-80">
        <Card className="rounded-xl">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
            <Skeleton className="h-64 w-full rounded-lg" />
          </CardContent>
        </Card>
      </aside>
      <main className="flex-1">
        <Skeleton className="mb-2 h-6 w-48" />
        <Skeleton className="mb-6 h-4 w-72" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-xl">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="size-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-20 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function SlotsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i} className="rounded-xl">
          <CardContent className="flex items-center justify-center gap-2 px-3 py-4">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
