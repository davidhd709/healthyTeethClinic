import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Phone, MessageCircle, Mail, Clock } from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import SectionHeading from '@/components/shared/SectionHeading';
import ContactForm from '@/components/contact/ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import {
  CLINIC_PHONE,
  CLINIC_WHATSAPP,
  CLINIC_EMAIL,
  CLINIC_ADDRESS,
  CLINIC_HOURS,
} from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contacto | Healthy Teeth Clinic',
  description:
    'Contacta a Healthy Teeth Clinic. Escribenos, llamanos o visitanos en nuestra sede en Bogota. Estaremos encantados de atenderte.',
  openGraph: {
    title: 'Contacto | Healthy Teeth Clinic',
    description:
      'Ponte en contacto con nosotros. Multiples canales de comunicacion para tu comodidad.',
  },
};

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: 'Direccion',
    value: CLINIC_ADDRESS,
    href: undefined as string | undefined,
    external: false,
  },
  {
    icon: Phone,
    label: 'Telefono',
    value: CLINIC_PHONE,
    href: `tel:${CLINIC_PHONE.replace(/\s/g, '')}`,
    external: false,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CLINIC_WHATSAPP,
    href: `https://wa.me/${CLINIC_WHATSAPP.replace(/[\s+]/g, '')}`,
    external: true,
  },
  {
    icon: Mail,
    label: 'Correo electronico',
    value: CLINIC_EMAIL,
    href: `mailto:${CLINIC_EMAIL}`,
    external: false,
  },
  {
    icon: Clock,
    label: 'Horario de atencion',
    value: CLINIC_HOURS,
    href: undefined as string | undefined,
    external: false,
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageHero
        title="Contactanos"
        subtitle="Estamos aqui para ayudarte. Comunicate con nosotros a traves del canal que prefieras o envíanos un mensaje directamente."
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Contacto', href: '/contacto' },
        ]}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Column: Contact Information */}
            <div className="space-y-8">
              <div>
                <SectionHeading
                  title="Informacion de Contacto"
                  subtitle="Multiples canales de comunicacion para tu comodidad. No dudes en escribirnos o visitarnos."
                  centered={false}
                />
              </div>

              {/* Contact items */}
              <div className="space-y-4">
                {CONTACT_ITEMS.map((item) => {
                  const content = (
                    <Card
                      key={item.label}
                      className="group rounded-xl border-border/60 transition-all hover:border-primary/30 hover:shadow-sm"
                    >
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                          <item.icon className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground break-words">
                            {item.value}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );

                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-xl"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return <div key={item.label}>{content}</div>;
                })}
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-xl border border-border/60">
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5">
                  {/* Decorative grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }} />
                  <div className="relative text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="size-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Mapa proximamente
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {CLINIC_ADDRESS}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-border/50 bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Prefiere agendar directamente?
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-primary" />
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Si ya sabes que servicio necesitas, puedes agendar tu cita en linea
            de forma rapida y sencilla. Elige tu especialista, fecha y horario
            preferido.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/agendar"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Agendar cita
            </Link>
            <Link
              href="/disponibilidad"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Ver disponibilidad
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
