import Link from 'next/link';
import { SmilePlus, Phone, Mail, MapPin, Clock, MessageCircle, Globe, Share2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  CLINIC_NAME,
  CLINIC_PHONE,
  CLINIC_WHATSAPP,
  CLINIC_EMAIL,
  CLINIC_ADDRESS,
  CLINIC_HOURS,
  NAV_LINKS,
} from '@/lib/constants';

const SERVICES_LINKS = [
  { href: '/servicios/limpieza-dental', label: 'Limpieza Dental' },
  { href: '/servicios/ortodoncia', label: 'Ortodoncia' },
  { href: '/servicios/blanqueamiento', label: 'Blanqueamiento' },
  { href: '/servicios/implantes', label: 'Implantes Dentales' },
  { href: '/servicios/endodoncia', label: 'Endodoncia' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <SmilePlus className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
              <span className="text-lg font-bold tracking-tight text-white">
                {CLINIC_NAME}
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Cuidamos tu salud dental con tecnología de vanguardia y un equipo
              de especialistas comprometidos con tu bienestar. Tu sonrisa, nuestra
              prioridad.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                aria-label="Sitio web"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Redes sociales"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
              >
                <Share2 className="size-4" />
              </a>
              <a
                href="#"
                aria-label="Mensajes"
                className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
              >
                <MessageCircle className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/agendar"
                  className="text-sm text-slate-400 transition-colors hover:text-primary"
                >
                  Agendar Cita
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Servicios
            </h3>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href={`tel:${CLINIC_PHONE.replace(/\s/g, '')}`}
                  className="text-sm text-slate-400 transition-colors hover:text-primary"
                >
                  {CLINIC_PHONE}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-accent" />
                <a
                  href={`https://wa.me/${CLINIC_WHATSAPP.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition-colors hover:text-accent"
                >
                  WhatsApp: {CLINIC_WHATSAPP}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${CLINIC_EMAIL}`}
                  className="text-sm text-slate-400 transition-colors hover:text-primary"
                >
                  {CLINIC_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm text-slate-400">{CLINIC_ADDRESS}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-sm text-slate-400">{CLINIC_HOURS}</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-slate-800" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} {CLINIC_NAME}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/politica-de-privacidad"
              className="text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              Política de privacidad
            </Link>
            <Link
              href="/terminos-y-condiciones"
              className="text-xs text-slate-500 transition-colors hover:text-slate-300"
            >
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
