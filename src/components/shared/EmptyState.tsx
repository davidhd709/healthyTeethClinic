import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: EmptyStateAction;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-muted">
        <Icon className="size-10 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      {action && (
        <Button asChild className="mt-6 gap-2 rounded-lg">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
