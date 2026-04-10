'use client';

import { useEffect } from 'react';

interface Props {
  clientId: string;
  configUrl: string;
}

declare global {
  interface Window {
    botpress?: {
      on?: (event: string, callback: () => void) => void;
    };
  }
}

export default function BotpressChatInner({ clientId, configUrl }: Props) {
  useEffect(() => {
    // Avoid injecting twice
    if (document.getElementById('bp-webchat-inject')) return;

    const injectScript = document.createElement('script');
    injectScript.id = 'bp-webchat-inject';
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.6/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    const configScript = document.createElement('script');
    configScript.id = 'bp-webchat-config';
    configScript.src = configUrl;
    configScript.defer = true;
    document.body.appendChild(configScript);

    return () => {
      document.getElementById('bp-webchat-inject')?.remove();
      document.getElementById('bp-webchat-config')?.remove();
    };
  }, [clientId, configUrl]);

  return null;
}
