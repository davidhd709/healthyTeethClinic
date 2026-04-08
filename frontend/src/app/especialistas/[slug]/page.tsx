import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  CalendarPlus,
  ArrowLeft,
  BriefcaseMedical,
  Clock,
  GraduationCap,
  Stethoscope,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import PageHero from '@/components/shared/PageHero';
import ServiceCard from '@/components/shared/ServiceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { DAYS_MAP } from '@/lib/constants';
import type { ISpecialist, IService, IWeeklySchedule } from '@/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(apiUrl('/api/specialists'), { cache: 'no-store' });
    if (!res.ok) return { title: 'Especialista | Healthy Teeth Clinic' };
    const specialists: ISpecialist[] = await res.json();
    const specialist = specialists.find((s) => s.slug === slug);

    if (!specialist) {
      return { title: 'Especialista no encontrado | Healthy Teeth Clinic' };
    }

    return {
      title: `${specialist.name} - ${specialist.specialty} | Healthy Teeth Clinic`,
      description: specialist.description,
      openGraph: {
        title: `${specialist.name} - ${specialist.specialty} | Healthy Teeth Clinic`,
        description: specialist.description,
      },
    };
  } catch {
    return { title: 'Especialista | Healthy Teeth Clinic' };
  }
}

export default async function EspecialistaDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let _specialist: ISpecialist | null = null;
  let services: IService[] = [];

  try {
    const [specialistsRes, servicesRes] = await Promise.all([
      fetch(apiUrl('/api/specialists'), { cache: 'no-store' }),
      fetch(apiUrl('/api/services'), { cache: 'no-store' }),
    ]);

    const allSpecialists: ISpecialist[] = specialistsRes.ok ? await specialistsRes.json() : [];
    const allServices: IService[] = servicesRes.ok ? await servicesRes.json() : [];

    _specialist = allSpecialists.find((s) => s.slug === slug) ?? null;
    if (!_specialist) notFound();

    // Filter related services
    services = allServices.filter((svc) =>
      _specialist!.services?.some((s: string | IService) => {
        const id = typeof s === 'string' ? s : (s as IService)._id;
        return id === svc._id;
      })
    );
  } catch (error) {
    // If it's a Next.js notFound redirect, re-throw it
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    notFound();
  }

  // After the catch block, _specialist is guaranteed non-null (notFound() is never-returning)
  const specialist = _specialist as ISpecialist;
  const initials = getInitials(specialist.name);

  // Order schedule by day of week
  const dayOrder = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
  ];
  const sortedSchedule = [...specialist.weeklySchedule].sort(
    (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
  );

  return (
    <>
      <PageHero
        title={specialist.name}
        subtitle={specialist.specialty}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Especialistas', href: '/especialistas' },
          { label: specialist.name, href: `/especialistas/${specialist.slug}` },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/especialistas"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Volver a Especialistas
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Left column - Profile card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-border/50 shadow-lg">
                  <CardContent className="flex flex-col items-center p-8">
                    {/* Large avatar */}
                    <div className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-4xl font-bold text-white shadow-xl ring-4 ring-primary/10">
                      {initials}
                    </div>

                    <h2 className="mt-5 text-center text-xl font-bold text-foreground">
                      {specialist.name}
                    </h2>

                    <Badge
                      variant="secondary"
                      className="mt-2 px-3 py-1 text-sm"
                    >
                      {specialist.specialty}
                    </Badge>

                    {specialist.subspecialty && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {specialist.subspecialty}
                      </Badge>
                    )}

                    {/* Quick stats */}
                    <div className="mt-6 w-full space-y-3">
                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <GraduationCap className="size-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Experiencia
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {specialist.experience} anos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Stethoscope className="size-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Servicios
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {services.length} tratamientos
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                        <Clock className="size-5 shrink-0 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Disponibilidad
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {sortedSchedule.length} dias/semana
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      asChild
                      size="lg"
                      className="mt-6 w-full gap-2 rounded-xl"
                    >
                      <Link
                        href={`/agendar?especialista=${specialist.slug}`}
                      >
                        <CalendarPlus className="size-4" />
                        Agendar con este especialista
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right column - Details */}
            <div className="space-y-10 lg:col-span-2">
              {/* Biography */}
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <BriefcaseMedical className="size-5 text-primary" />
                  Sobre el especialista
                </h3>
                <div className="mt-1 h-1 w-12 rounded-full bg-primary" />
                <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {specialist.description}
                </p>
              </div>

              {/* Weekly schedule */}
              {sortedSchedule.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <Clock className="size-5 text-primary" />
                    Horario Semanal
                  </h3>
                  <div className="mt-1 h-1 w-12 rounded-full bg-primary" />

                  <Card className="mt-4 overflow-hidden border-border/50">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border/50 bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6">
                              Dia
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sm:px-6">
                              Horario
                            </th>
                            <th className="hidden px-4 py-3 text-left text-sm font-semibold text-foreground sm:table-cell sm:px-6">
                              Bloque
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          {sortedSchedule.map((schedule: IWeeklySchedule) => (
                            <tr
                              key={schedule.day}
                              className="transition-colors hover:bg-muted/30"
                            >
                              <td className="px-4 py-3.5 sm:px-6">
                                <span className="font-medium text-foreground">
                                  {DAYS_MAP[schedule.day] ?? schedule.day}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 sm:px-6">
                                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <span className="size-1.5 rounded-full bg-green-500" />
                                  {schedule.startTime} - {schedule.endTime}
                                </span>
                              </td>
                              <td className="hidden px-4 py-3.5 sm:table-cell sm:px-6">
                                <Badge variant="outline" className="text-xs">
                                  {schedule.blockDuration} min
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Available services */}
              {services.length > 0 && (
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <Stethoscope className="size-5 text-primary" />
                    Servicios Disponibles
                  </h3>
                  <div className="mt-1 h-1 w-12 rounded-full bg-primary" />

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {services.map((service) => (
                      <Link
                        key={service._id}
                        href={`/servicios/${service.slug}`}
                        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                      >
                        <ServiceCard service={service} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-accent px-6 py-12 shadow-xl sm:px-12 sm:py-16 lg:px-16">
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-accent/20 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Listo para mejorar tu sonrisa?
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Agenda tu cita con {specialist.name} y da el primer paso hacia
                una sonrisa mas saludable y radiante.
              </p>
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-xl bg-white text-primary shadow-lg hover:bg-white/90"
              >
                <Link href={`/agendar?especialista=${specialist.slug}`}>
                  <CalendarPlus className="size-4" />
                  Agendar Cita Ahora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
