'use client';

import { useState, useCallback } from 'react';
import { MessageCircle, X } from 'lucide-react';

const BOTPRESS_CLIENT_ID = process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID;
const BOTPRESS_WEBCHAT_URL =
  process.env.NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL ||
  'https://cdn.botpress.cloud/webchat/v2.2/shareable.html';

export default function BotpressChat() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Graceful degradation: don't render if no client ID is configured
  if (!BOTPRESS_CLIENT_ID) {
    return null;
  }

  const iframeSrc = `${BOTPRESS_WEBCHAT_URL}?botId=${BOTPRESS_CLIENT_ID}`;

  return (
    <>
      {/* Chat Container */}
      <div
        className={`fixed bottom-24 right-6 z-[9999] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ease-in-out max-md:inset-0 max-md:bottom-0 max-md:right-0 max-md:rounded-none md:h-[600px] md:w-[400px] ${
          isOpen
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-600 to-cyan-600 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-white" />
            <span className="font-semibold text-white">
              Asistente Virtual
            </span>
          </div>
          <button
            onClick={toggleChat}
            className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Cerrar chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Iframe */}
        <div className="flex-1">
          {isOpen && (
            <iframe
              src={iframeSrc}
              title="Chat de Healthy Teeth Clinic"
              className="h-full w-full border-0"
              allow="microphone"
            />
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        }`}
        aria-label="Abrir chat"
      >
        <MessageCircle className="h-6 w-6" />
        {/* Pulse ring */}
        <span className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-25" />
      </button>
    </>
  );
}
