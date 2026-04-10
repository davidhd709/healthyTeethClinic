import Link from 'next/link';
import { CalendarPlus, BriefcaseMedical } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DAYS_MAP } from '@/lib/constants';
import type { ISpecialist } from '@/types';

interface SpecialistCardProps {
  specialist: ISpecialist;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const initials = getInitials(specialist.name);
  const availableDays = specialist.weeklySchedule
    .map((s) => DAYS_MAP[s.day] ?? s.day)
    .join(', ');

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="items-center pb-2">
        {/* Avatar placeholder with gradient */}
        <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-2xl font-bold text-white shadow-md ring-4 ring-primary/10 transition-shadow duration-300 group-hover:ring-primary/20">
          {initials}
        </div>
        <Link
          href={`/especialistas/${specialist.slug}`}
          className="mt-3 text-center text-lg font-semibold text-foreground transition-colors hover:text-primary"
        >
          {specialist.name}
        </Link>
        <Badge variant="secondary" className="mt-1">
          {specialist.specialty}
        </Badge>
        {specialist.subspecialty && (
          <Badge variant="outline" className="mt-1 text-xs">
            {specialist.subspecialty}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pb-2">
        <p className="line-clamp-3 text-center text-sm leading-relaxed text-muted-foreground">
          {specialist.description}
        </p>

        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <BriefcaseMedical className="size-3.5 text-primary" />
          <span>{specialist.experience} años de experiencia</span>
        </div>

        {availableDays && (
          <p className="text-center text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Disponible:</span>{' '}
            {availableDays}
          </p>
        )}
      </CardContent>

      <CardFooter className="justify-center pt-2">
        <Button asChild size="default" className="gap-2 rounded-lg">
          <Link href={`/agendar?especialista=${specialist.slug}`}>
            <CalendarPlus className="size-4" />
            Agendar Cita
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
