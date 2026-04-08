import type { Metadata } from 'next';
import Link from 'next/link';
import { apiUrl } from '@/lib/api';
import PageHero from '@/components/shared/PageHero';
import SectionHeading from '@/components/shared/SectionHeading';
import SpecialistCard from '@/components/shared/SpecialistCard';
import EmptyState from '@/components/shared/EmptyState';
import { Heart, Shield, Award } from 'lucide-react';
import type { ISpecialist } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Especialistas | Healthy Teeth Clinic',
  description:
    'Conoce a nuestro equipo de especialistas odontologicos. Profesionales certificados con anos de experiencia dedicados a brindarte la mejor atencion dental en Bogota.',
  openGraph: {
    title: 'Especialistas | Healthy Teeth Clinic',
    description:
      'Equipo de especialistas odontologicos certificados. Conoce a los profesionales que cuidaran tu sonrisa.',
  },
};

export default async function EspecialistasPage() {
  let specialists: ISpecialist[] = [];
  try {
    const res = await fetch(apiUrl('/api/specialists'), { cache: 'no-store' });
    if (res.ok) specialists = await res.json();
  } catch {
    // API unavailable – render with empty list
  }

  return (
    <>
      <PageHero
        title="Nuestro Equipo de Especialistas"
        subtitle="Profesionales certificados y apasionados por la odontologia, comprometidos con brindarte una experiencia excepcional en cada visita."
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Especialistas', href: '/especialistas' },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Conoce a Nuestros Profesionales"
            subtitle="Cada miembro de nuestro equipo esta altamente capacitado para ofrecerte tratamientos seguros, eficaces y personalizados."
          />

          {specialists.length > 0 ? (
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
          ) : (
            <EmptyState
              title="No hay especialistas disponibles"
              description="Estamos actualizando nuestro directorio de especialistas. Vuelve pronto o contactanos para mas informacion."
              action={{ label: 'Contactanos', href: '/contacto' }}
            />
          )}
        </div>
      </section>

      {/* Team commitment section */}
      <section className="border-t border-border/50 bg-muted/30 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Compromiso con la Excelencia
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Nuestro equipo de especialistas se mantiene en constante formacion
              y actualizacion, participando en congresos y certificaciones
              internacionales. Creemos que la excelencia clinica, combinada con
              un trato humano y cercano, es la base de una sonrisa saludable y
              duradera.
            </p>
          </div>

          {/* Values grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Award className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Certificaciones Internacionales
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Profesionales con formacion continua y credenciales reconocidas a
                nivel internacional.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-accent/20 text-accent-foreground">
                <Heart className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Atencion Personalizada
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cada paciente recibe un plan de tratamiento unico, adaptado a sus
                necesidades y expectativas.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Shield className="size-7" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Protocolos de Bioseguridad
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cumplimos con los mas altos estandares de seguridad y
                esterilizacion para tu tranquilidad.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
