import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, ArrowRight, ExternalLink } from 'lucide-react';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';
import PageHero from '@/components/shared/PageHero';
import SectionHeading from '@/components/shared/SectionHeading';
import ServiceCard from '@/components/shared/ServiceCard';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import type { IService } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Servicios | Healthy Teeth Clinic',
  description:
    'Descubre nuestra amplia gama de servicios odontologicos. Desde limpiezas y blanqueamientos hasta implantes y ortodoncia, contamos con la tecnologia y especialistas para cuidar tu sonrisa.',
  openGraph: {
    title: 'Servicios | Healthy Teeth Clinic',
    description:
      'Servicios odontologicos premium en Bogota. Tecnologia de vanguardia y especialistas certificados para el cuidado integral de tu salud oral.',
  },
};

export default async function ServiciosPage() {
  let services: IService[] = [];
  try {
    await connectDB();
    const docs = await Service.find({ isActive: true }).lean();
    services = JSON.parse(JSON.stringify(docs));
  } catch {
    // DB unavailable – render with empty list
  }

  return (
    <>
      <PageHero
        title="Nuestros Servicios"
        subtitle="Ofrecemos una atencion odontologica integral con tecnologia de ultima generacion y un equipo de especialistas comprometidos con tu bienestar. Descubre todo lo que podemos hacer por tu sonrisa."
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Servicios', href: '/servicios' },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Cuidado Dental Completo"
            subtitle="Cada tratamiento esta disenado para brindarte resultados excepcionales en un ambiente comodo y seguro."
          />

          {services.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div key={service._id}>
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay servicios disponibles"
              description="Estamos actualizando nuestra oferta de servicios. Vuelve pronto o contactanos para mas informacion."
              action={{ label: 'Contactanos', href: '/contacto' }}
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-accent px-6 py-12 shadow-xl sm:px-12 sm:py-16 lg:px-16">
            {/* Decorative elements */}
            <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-16 -left-16 size-64 rounded-full bg-accent/20 blur-2xl" />

            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:gap-8 lg:text-left">
              <div className="flex-1 space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  No encuentras lo que buscas?
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Nuestro equipo esta listo para atender todas tus necesidades
                  odontologicas. Contactanos y te orientaremos sobre el
                  tratamiento ideal para ti.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="gap-2 rounded-xl bg-white text-primary shadow-lg hover:bg-white/90"
                >
                  <Link href="/contacto">
                    <Phone className="size-4" />
                    Contactanos
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-xl border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                >
                  <Link href="/agendar">
                    Agendar Cita
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
