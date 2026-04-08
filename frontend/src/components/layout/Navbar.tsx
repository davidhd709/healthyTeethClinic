'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SmilePlus, CalendarPlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { CLINIC_NAME, NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <SmilePlus className="size-8 text-primary transition-transform duration-300 group-hover:scale-110" />
          <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {CLINIC_NAME}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-3/4',
                  isActive
                    ? 'text-primary after:w-3/4'
                    : 'text-muted-foreground'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button asChild size="default" className="gap-2 rounded-lg">
            <Link href="/agendar">
              <CalendarPlus className="size-4" />
              Agendar Cita
            </Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SmilePlus className="size-6 text-primary" />
                {CLINIC_NAME}
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary',
                        isActive
                          ? 'bg-secondary text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>

            <div className="mt-8 px-4">
              <SheetClose asChild>
                <Button asChild className="w-full gap-2 rounded-lg">
                  <Link href="/agendar">
                    <CalendarPlus className="size-4" />
                    Agendar Cita
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
