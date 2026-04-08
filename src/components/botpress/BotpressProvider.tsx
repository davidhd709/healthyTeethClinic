'use client';

import { type ReactNode } from 'react';
import BotpressChat from './BotpressChat';

/**
 * Context data that can be passed to the Botpress webchat
 * for future personalized conversation experiences.
 */
export interface BotpressContextData {
  /** The current page the user is viewing (e.g. "/servicios") */
  currentPage?: string;
  /** The service the user has selected or is browsing */
  selectedService?: string;
  /** The specialist the user has selected or is viewing */
  selectedSpecialist?: string;
  /** The authenticated user's name, if available */
  userName?: string;
}

interface BotpressProviderProps {
  children: ReactNode;
  /** Optional context data for the Botpress conversation (reserved for future API integration) */
  contextData?: BotpressContextData;
}

/**
 * BotpressProvider is a thin wrapper that renders the BotpressChat widget
 * alongside the application's children. It accepts optional contextData
 * that will be forwarded to the chat widget once the Botpress Webchat API
 * integration is fully implemented (e.g., via postMessage to the iframe
 * or through Botpress conversation variables).
 *
 * Usage:
 * ```tsx
 * <BotpressProvider contextData={{ currentPage: '/servicios', userName: 'Maria' }}>
 *   <YourPageContent />
 * </BotpressProvider>
 * ```
 */
export default function BotpressProvider({
  children,
  contextData,
}: BotpressProviderProps) {
  // contextData is accepted as a prop for future use.
  // When the Botpress Webchat JS SDK is integrated, this data can be
  // sent to the bot via `window.botpressWebChat.sendPayload(...)` or
  // by setting user variables through the Botpress API.
  void contextData;

  return (
    <>
      {children}
      <BotpressChat />
    </>
  );
}
