import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import BotpressChat from '@/components/botpress/BotpressChat';
import './globals.css';

export const metadata: Metadata = {
  title: 'Healthy Teeth Clinic | Tu Sonrisa, Nuestra Pasion',
  description:
    'Clinica odontologica premium en Bogota. Especialistas certificados, tecnologia de vanguardia y atencion personalizada. Agenda tu cita online para diseno de sonrisa, ortodoncia, implantes y mas.',
  openGraph: {
    title: 'Healthy Teeth Clinic | Tu Sonrisa, Nuestra Pasion',
    description:
      'Clinica odontologica premium en Bogota. Especialistas certificados, tecnologia de vanguardia y atencion personalizada.',
    type: 'website',
    locale: 'es_CO',
    siteName: 'Healthy Teeth Clinic',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
        <BotpressChat />
      </body>
    </html>
  );
}
