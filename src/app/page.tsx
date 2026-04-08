import Link from 'next/link';
import {
  Shield,
  Heart,
  Zap,
  Clock,
  CalendarPlus,
  ArrowRight,
  CheckCircle2,
  Search,
  UserCheck,
  CalendarCheck,
  Award,
  Users,
  Monitor,
  Globe,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionHeading from '@/components/shared/SectionHeading';
import ServiceCard from '@/components/shared/ServiceCard';
import SpecialistCard from '@/components/shared/SpecialistCard';
import TestimonialCard from '@/components/shared/TestimonialCard';
import { testimonialsData } from '@/lib/seed-data';
import { connectDB } from '@/lib/db';
import Service from '@/models/Service';
import Specialist from '@/models/Specialist';
import type { IService, ISpecialist } from '@/types';

export const dynamic = 'force-dynamic';

/* ---------- data fetching ---------- */

async function getServices(): Promise<IService[]> {
  try {
    await connectDB();
    const docs = await Service.find({ isActive: true }).limit(6).lean();
    return JSON.parse(JSON.stringify(docs)) as IService[];
  } catch {
    return [];
  }
}

async function getSpecialists(): Promise<ISpecialist[]> {
  try {
    await connectDB();
    const docs = await Specialist.find({ isActive: true }).limit(4).lean();
    return JSON.parse(JSON.stringify(docs)) as ISpecialist[];
  } catch {
    return [];
  }
}

/* ---------- static data ---------- */

const VALUE_PROPS = [
  {
    icon: Shield,
    title: 'Especialistas Certificados',
    description:
      'Nuestro equipo cuenta con certificaciones internacionales y formacion continua en las tecnicas mas avanzadas.',
  },
  {
    icon: Heart,
    title: 'Atencion Personalizada',
    description:
      'Cada paciente es unico. Disenamos planes de tratamiento a la medida de tus necesidades.',
  },
  {
    icon: Zap,
    title: 'Tecnologia Avanzada',
    description:
      'Equipos de ultima generacion para diagnosticos precisos y tratamientos minimamente invasivos.',
  },
  {
    icon: Clock,
    title: 'Agenda Facil',
    description:
      'Reserva tu cita online en minutos. Sin filas, sin esperas innecesarias.',
  },
];

const TRUST_BADGES = [
  { icon: Award, label: '15+ Anos de Experiencia' },
  { icon: Users, label: '10,000+ Pacientes Satisfechos' },
  { icon: Monitor, label: 'Tecnologia de Ultima Generacion' },
  { icon: Globe, label: 'Certificacion Internacional' },
];

const STEPS = [
  {
    number: '01',
    icon: Search,
    title: 'Elige tu Servicio',
    description: 'Explora nuestros servicios y selecciona el que necesitas.',
  },
  {
    number: '02',
    icon: UserCheck,
    title: 'Selecciona Especialista y Horario',
    description:
      'Elige el profesional y la fecha que mas te convenga.',
  },
  {
    number: '03',
    icon: CalendarCheck,
    title: 'Confirma tu Cita',
    description:
      'Completa tus datos y recibe la confirmacion al instante.',
  },
];

const FAQS = [
  {
    question: 'Como puedo agendar una cita?',
    answer:
      'Puedes agendar tu cita directamente desde nuestra plataforma online. Solo selecciona el servicio que necesitas, elige al especialista y el horario disponible que prefieras, completa tus datos y recibiras la confirmacion al instante en tu correo electronico.',
  },
  {
    question: 'Cuales son los metodos de pago?',
    answer:
      'Aceptamos multiples metodos de pago para tu comodidad: efectivo, tarjetas de credito y debito (Visa, Mastercard, American Express), transferencias bancarias y pagos mediante plataformas digitales. Tambien ofrecemos facilidades de pago para tratamientos de mayor valor.',
  },
  {
    question: 'Atienden emergencias dentales?',
    answer:
      'Si, contamos con atencion de emergencias dentales. Si tienes dolor intenso, fractura dental, inflamacion severa u otra urgencia, contactanos de inmediato por telefono o WhatsApp y te asignaremos una cita prioritaria lo antes posible.',
  },
  {
    question: 'Los tratamientos son dolorosos?',
    answer:
      'Utilizamos tecnicas modernas y anestesia de ultima generacion para garantizar que tu experiencia sea lo mas comoda e indolora posible. Nuestros especialistas estan capacitados en procedimientos minimamente invasivos y siempre priorizan tu bienestar durante cada consulta.',
  },
  {
    question: 'Ofrecen planes de financiamiento?',
    answer:
      'Si, ofrecemos planes de financiamiento flexibles para que puedas acceder a los tratamientos que necesitas sin preocuparte por el costo total inmediato. Consulta con nuestro equipo administrativo las opciones disponibles segun tu tratamiento.',
  },
  {
    question: 'Cuanto dura una cita regular?',
    answer:
      'Una cita de revision o limpieza dental dura aproximadamente entre 30 y 60 minutos, dependiendo del tipo de procedimiento. Para tratamientos mas especializados, la duracion puede variar y sera informada previamente al agendar tu cita.',
  },
];

/* ---------- page component ---------- */

export default async function HomePage() {
  const [services, specialists] = await Promise.all([
    getServices(),
    getSpecialists(),
  ]);

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* decorative background shapes */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {/* large blurred circle top-right */}
          <div className="absolute -right-24 -top-24 size-[500px] rounded-full bg-primary/8 blur-3xl" />
          {/* small accent circle bottom-left */}
          <div className="absolute -bottom-16 -left-16 size-[350px] rounded-full bg-accent/10 blur-3xl" />
          {/* abstract tooth SVG watermark */}
          <svg
            viewBox="0 0 200 200"
            className="absolute right-[5%] top-[15%] size-72 text-primary/[0.04] lg:size-96"
            fill="currentColor"
          >
            <path d="M100 10c-20 0-35 15-45 35-8 16-10 35-5 55 4 15 12 30 22 45 8 12 18 25 28 40 10-15 20-28 28-40 10-15 18-30 22-45 5-20 3-39-5-55C135 25 120 10 100 10zm0 20c12 0 22 8 28 22 5 11 6 25 3 38-3 11-9 22-17 33-5 8-11 16-14 21-3-5-9-13-14-21-8-11-14-22-17-33-3-13-2-27 3-38 6-14 16-22 28-22z" />
          </svg>
          {/* grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Tu Sonrisa Perfecta{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Comienza Aqui
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Expertos en odontologia de alta calidad con tecnologia de
              vanguardia y un equipo humano comprometido con tu bienestar.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="gap-2 rounded-xl px-8 text-base shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                <Link href="/agendar">
                  <CalendarPlus className="size-5" />
                  Agenda tu Cita
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl px-8 text-base">
                <Link href="/servicios">
                  Conoce Nuestros Servicios
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* trust badges */}
          <div className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-border/50 bg-white/60 px-4 py-5 backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <badge.icon className="size-6 text-primary" />
                <span className="text-center text-xs font-semibold text-foreground sm:text-sm">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VALUE PROPOSITION ========== */}
      <section className="bg-slate-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Por Que Elegirnos?" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <item.icon className="size-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED SERVICES ========== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestros Servicios"
            subtitle="Ofrecemos una amplia gama de tratamientos odontologicos para cuidar tu salud oral"
          />

          {services.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Los servicios se estan cargando. Vuelve pronto para conocer nuestra
              oferta completa.
            </p>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
              <Link href="/servicios">
                Ver todos los servicios
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="bg-slate-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Agenda tu Cita en 3 Simples Pasos" />

          <div className="relative mx-auto max-w-4xl">
            {/* connecting line (desktop) */}
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block"
            />

            <div className="grid gap-10 sm:grid-cols-3">
              {STEPS.map((step, idx) => (
                <div key={step.number} className="relative flex flex-col items-center text-center">
                  {/* number badge */}
                  <div className="relative z-10 mb-6 flex size-32 flex-col items-center justify-center rounded-3xl border border-primary/10 bg-white shadow-lg shadow-primary/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <span className="text-xs font-bold tracking-widest text-primary/50">
                      PASO
                    </span>
                    <span className="text-3xl font-extrabold text-primary">
                      {step.number}
                    </span>
                    <step.icon className="mt-1 size-6 text-primary/70" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>

                  {/* mobile arrow between steps */}
                  {idx < STEPS.length - 1 && (
                    <ArrowRight className="mt-6 size-5 rotate-90 text-primary/30 sm:hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Button asChild size="lg" className="gap-2 rounded-xl px-8 text-base shadow-lg shadow-primary/25">
              <Link href="/agendar">
                <CalendarPlus className="size-5" />
                Agendar Ahora
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== FEATURED SPECIALISTS ========== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Nuestro Equipo de Especialistas"
            subtitle="Profesionales comprometidos con tu sonrisa"
          />

          {specialists.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {specialists.map((specialist) => (
                <SpecialistCard key={specialist._id} specialist={specialist} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Pronto podras conocer a nuestros especialistas. Estamos preparando
              la informacion.
            </p>
          )}

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
              <Link href="/especialistas">
                Conoce todo el equipo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="bg-slate-50/60 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Lo Que Dicen Nuestros Pacientes" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonialsData.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Preguntas Frecuentes" />

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group rounded-xl border border-border/50 bg-white shadow-sm transition-shadow open:shadow-md [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary">
                  <span>{faq.question}</span>
                  <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-20 sm:py-24">
        {/* decorative shapes */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-accent/10 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Listo para Transformar tu Sonrisa?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            Agenda tu cita hoy y da el primer paso hacia una sonrisa saludable y
            radiante.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-xl bg-white px-10 text-base font-semibold text-primary shadow-xl transition-all hover:bg-white/90 hover:shadow-2xl"
            >
              <Link href="/agendar">
                <CalendarPlus className="size-5" />
                Agenda tu Cita Ahora
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              Sin compromiso
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              Confirmacion inmediata
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              Cancelacion gratuita
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
