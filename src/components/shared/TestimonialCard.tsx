import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ITestimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: ITestimonial;
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

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const initials = getInitials(testimonial.name);

  return (
    <Card className="relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300 hover:shadow-md">
      <CardContent className="space-y-4 pt-6">
        {/* Quote icon */}
        <Quote className="size-8 text-primary/20" />

        {/* Comment */}
        <p className="text-sm leading-relaxed text-muted-foreground italic">
          &ldquo;{testimonial.comment}&rdquo;
        </p>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-4 ${
                i < testimonial.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Person info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {testimonial.name}
            </p>
            <Badge variant="outline" className="mt-0.5 text-xs">
              {testimonial.treatment}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
