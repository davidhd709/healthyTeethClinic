import type { Metadata } from 'next';
import PageHero from '@/components/shared/PageHero';
import BookingWizard from '@/components/booking/BookingWizard';

export const metadata: Metadata = {
  title: 'Agendar Cita | Healthy Teeth Clinic',
  description:
    'Agenda tu cita odontologica en linea. Selecciona el servicio, especialista, fecha y horario que mejor se ajuste a tu agenda. Proceso rapido y sencillo.',
  openGraph: {
    title: 'Agendar Cita | Healthy Teeth Clinic',
    description:
      'Agenda tu cita odontologica en linea de forma rapida y sencilla. Elige entre nuestros servicios y especialistas disponibles.',
  },
};

export default function AgendarPage() {
  return (
    <>
      <PageHero
        title="Agenda tu Cita"
        subtitle="Reserva tu cita en pocos pasos. Selecciona el servicio, especialista y horario que prefieras."
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Agendar Cita', href: '/agendar' },
        ]}
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BookingWizard />
        </div>
      </section>
    </>
  );
}
