import { createElement, type ReactElement } from 'react';
import {
  Stethoscope,
  AlignCenter,
  Target,
  Shield,
  Wrench,
  Sparkles,
  Sun,
  Baby,
  Scissors,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  Stethoscope,
  AlignCenter,
  Target,
  Shield,
  Wrench,
  Sparkles,
  Sun,
  Baby,
  Scissors,
  RefreshCw,
};

export function getIcon(name: string): LucideIcon | undefined {
  return iconMap[name];
}

export function getIconElement(name: string, className?: string): ReactElement | null {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return createElement(Icon, { className });
}
