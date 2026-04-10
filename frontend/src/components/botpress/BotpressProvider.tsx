'use client';

import { type ReactNode } from 'react';
import BotpressChat from './BotpressChat';

export interface BotpressContextData {
  currentPage?: string;
  selectedService?: string;
  selectedSpecialist?: string;
  userName?: string;
}

interface BotpressProviderProps {
  children: ReactNode;
  contextData?: BotpressContextData;
}

export default function BotpressProvider({
  children,
}: BotpressProviderProps) {
  return (
    <>
      {children}
      <BotpressChat />
    </>
  );
}
