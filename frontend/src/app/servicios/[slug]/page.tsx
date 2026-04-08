import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  DollarSign,
  CalendarPlus,
  ArrowLeft,
  BriefcaseMedical,
  Users,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import PageHero from '@/components/shared/PageHero';
import SectionHeading from '@/components/shared/SectionHeading';
import SpecialistCard from '@/components/shared/SpecialistCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getIconElement } from '@/lib/icon-map';
import type { IService, ISpecialist } from '@/types';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const res = await fetch(apiUrl('/api/services'), { cache: 'no-store' });
    if (!res.ok) return { title: 'Servicio | Healthy Teeth Clinic' };
    const services: IService[] = await res.json();
    const service = services.find((s) => s.slug === slug);

    if (!service) {
      return { title: 'Servicio no encontrado | Healthy Teeth Clinic' };
    }

    return {
      title: `${service.name} | Healthy Teeth Clinic`,
      description: service.description,
      openGraph: {
        title: `${service.name} | Healthy Teeth Clinic`,
        description: service.description,
      },
    };
  } catch {
    return { title: 'Servicio | Healthy Teeth Clinic' };
  }
}

export default async function ServicioDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let _service: IService | null = null;
  let specialists: ISpecialist[] = [];

  try {
    const [servicesRes, specialistsRes] = await Promise.all([
      fetch(apiUrl('/api/services'), { cache: 'no-store' }),
      fetch(apiUrl('/api/specialists'), { cache: 'no-store' }),
    ]);

    const allServices: IService[] = servicesRes.ok ? await servicesRes.json() : [];
    const allSpecialists: ISpecialist[] = specialistsRes.ok ? await specialistsRes.json() : [];

    _service = allServices.find((s) => s.slug === slug) ?? null;
    if (!_service) notFound();

    // Filter specialists who provide this service
    specialists = allSpecialists.filter((sp) =>
      _service!.specialists?.includes(sp._id) ||
      sp.services?.some((svc: string | IService) => {
        const id = typeof svc === 'string' ? svc : (svc as IService)._id;
        return id === _service!._id;
      })
    );
  } catch (error) {
    // If it's a Next.js notFound redirect, re-throw it
    if (error && typeof error === 'object' && 'digest' in error) throw error;
    notFound();
  }

  // After the catch block, _service is guaranteed non-null (notFound() is never-returning)
  const service = _service as IService;
  const serviceIcon = getIconElement(service.icon, 'size-8');

  return (
    <>
      <PageHero
        title={service.name}
        subtitle={`Duracion estimada: ${service.durationMinutes} minutos`}
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
          { label: service.name, href: `/servicios/${service.slug}` },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/servicios"
            className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Volver a Servicios
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Service icon & description */}
                <div className="flex items-start gap-5">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {serviceIcon ?? (
                      <BriefcaseMedical className="size-8" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                      {service.name}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="gap-1.5">
                        <Clock className="size-3" />
                        {service.durationMinutes} minutos
                      </Badge>
                      {service.basePrice != null && (
                        <Badge variant="outline" className="gap-1.5">
                          <DollarSign className="size-3" />
                          {service.basePrice.toLocaleString('es-CO')} COP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full description */}
                <div className="prose prose-gray max-w-none">
                  <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {service.description}
                  </p>
                </div>

                {/* Key details cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Card className="border-border/50">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Clock className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Duracion estimada
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {service.durationMinutes} minutos
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {service.basePrice != null && (
                    <Card className="border-border/50">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                          <DollarSign className="size-6" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Precio desde
                          </p>
                          <p className="text-lg font-semibold text-foreground">
                            ${service.basePrice.toLocaleString('es-CO')} COP
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border-border/50">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                        <Users className="size-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Especialistas disponibles
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {specialists.length}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar - CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="overflow-hidden border-border/50 shadow-lg">
                  <div className="bg-gradient-to-br from-primary to-accent p-6">
                    <CalendarPlus className="mb-3 size-8 text-white" />
                    <h3 className="text-lg font-bold text-white">
                      Agenda tu cita
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      Reserva este servicio con uno de nuestros especialistas
                      certificados.
                    </p>
                  </div>
                  <CardContent className="space-y-3 p-6">
                    <Button
                      asChild
                      size="lg"
                      className="w-full gap-2 rounded-xl"
                    >
                      <Link href={`/agendar?servicio=${service.slug}`}>
                        <CalendarPlus className="size-4" />
                        Agendar Cita
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="w-full gap-2 rounded-xl"
                    >
                      <Link href="/contacto">Consultar sin compromiso</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related specialists */}
      {specialists.length > 0 && (
        <section className="border-t border-border/50 bg-muted/30 py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Especialistas para este servicio"
              subtitle="Profesionales altamente calificados listos para atenderte."
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {specialists.map((specialist) => (
                <Link
                  key={specialist._id}
                  href={`/especialistas/${specialist.slug}`}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                >
                  <SpecialistCard specialist={specialist} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
