import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
}: SectionHeadingProps) {
  return (
    <div className={cn('mb-12 space-y-3', centered && 'text-center')}>
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <div
        className={cn(
          'h-1 w-16 rounded-full bg-primary',
          centered ? 'mx-auto' : ''
        )}
      />
      {subtitle && (
        <p
          className={cn(
            'max-w-2xl text-base text-muted-foreground sm:text-lg',
            centered && 'mx-auto'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
