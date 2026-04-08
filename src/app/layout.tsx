import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import BotpressChat from '@/components/botpress/BotpressChat';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
