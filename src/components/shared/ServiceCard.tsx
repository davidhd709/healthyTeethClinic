import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getIcon } from '@/lib/icon-map';
import type { IService } from '@/types';

interface ServiceCardProps {
  service: IService;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = getIcon(service.icon);

  return (
    <Card className="group relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-2">
        <Link href={`/servicios/${service.slug}`} className="block">
          <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            {Icon ? <Icon className="size-6" /> : <span className="text-lg font-bold">{service.name.charAt(0)}</span>}
          </div>
          <CardTitle className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {service.name}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3 pb-2">
        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-primary" />
            {service.durationMinutes} min
          </span>
          {service.basePrice != null && (
            <span className="font-semibold text-foreground">
              ${service.basePrice.toLocaleString('es-CO')}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          asChild
          variant="ghost"
          className="group/btn gap-2 px-0 text-primary hover:bg-transparent hover:text-primary/80"
        >
          <Link href={`/agendar?servicio=${service.slug}`}>
            Agendar Cita
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
