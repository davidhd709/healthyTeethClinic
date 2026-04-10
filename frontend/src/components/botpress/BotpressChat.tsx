'use client';

import dynamic from 'next/dynamic';

const CLIENT_ID = process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID;
const CONFIG_URL = process.env.NEXT_PUBLIC_BOTPRESS_CONFIG_URL;

const BotpressChatInner = dynamic(
  () => import('./BotpressChatInner'),
  { ssr: false }
);

export default function BotpressChat() {
  if (!CLIENT_ID || !CONFIG_URL) return null;

  return <BotpressChatInner clientId={CLIENT_ID} configUrl={CONFIG_URL} />;
}
