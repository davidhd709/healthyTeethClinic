import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import AvailabilityExplorer from '@/components/availability/AvailabilityExplorer';

export const metadata: Metadata = {
  title: 'Disponibilidad | Healthy Teeth Clinic',
  description:
    'Consulta la disponibilidad de nuestros especialistas odontologicos. Encuentra el horario y la fecha que mejor se ajuste a tu agenda.',
  openGraph: {
    title: 'Disponibilidad | Healthy Teeth Clinic',
    description:
      'Explora la disponibilidad de horarios de nuestros especialistas dentales y agenda tu cita facilmente.',
  },
};

export default function DisponibilidadPage() {
  return (
    <>
      <PageHero
        title="Disponibilidad de Especialistas"
        subtitle="Explora los horarios disponibles de nuestros profesionales y encuentra el momento ideal para tu consulta."
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Disponibilidad', href: '/disponibilidad' },
        ]}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AvailabilityExplorer />
        </div>
      </section>
    </>
  );
}
