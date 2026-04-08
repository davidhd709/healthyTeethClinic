import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
}

export default function PageHero({ title, subtitle, breadcrumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-accent py-16 sm:py-20 lg:py-24">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]" />
      <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="size-3.5" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-white font-medium">{crumb.label}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className={cn(
            'mt-4 max-w-2xl text-base text-white/80 sm:text-lg leading-relaxed',
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
