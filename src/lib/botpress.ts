/**
 * Botpress integration utilities for Healthy Teeth Clinic.
 *
 * This module provides helper functions for interacting with the
 * Botpress Cloud API. The webchat iframe handles the client-side
 * conversation UI, while these utilities are intended for server-side
 * operations such as sending proactive events, handling webhooks,
 * and building conversation context.
 */

/** Configuration object returned by getBotpressConfig. */
export interface BotpressConfig {
  botId: string;
  webchatUrl: string;
  apiUrl: string;
  apiToken: string;
}

/** Payload shape for events sent to the Botpress API. */
export interface BotpressEventPayload {
  [key: string]: unknown;
}

/** Context object describing the user's current session. */
export interface ConversationContext {
  service: string | null;
  specialist: string | null;
  userName: string | null;
  locale: string;
  timestamp: string;
}

/**
 * Returns the Botpress configuration derived from environment variables.
 *
 * - `NEXT_PUBLIC_BOTPRESS_CLIENT_ID` - The bot/client ID used for the webchat.
 * - `NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL` - CDN URL for the webchat shareable page.
 * - `BOTPRESS_API_URL` - Base URL for the Botpress Cloud HTTP API.
 * - `BOTPRESS_API_TOKEN` - Bearer token for authenticating API requests.
 *
 * @returns A BotpressConfig object (values may be empty strings if env vars are not set).
 */
export function getBotpressConfig(): BotpressConfig {
  return {
    botId: process.env.NEXT_PUBLIC_BOTPRESS_CLIENT_ID ?? '',
    webchatUrl:
      process.env.NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL ??
      'https://cdn.botpress.cloud/webchat/v2.2/shareable.html',
    apiUrl: process.env.BOTPRESS_API_URL ?? '',
    apiToken: process.env.BOTPRESS_API_TOKEN ?? '',
  };
}

/**
 * Sends a custom event to the Botpress Cloud API.
 *
 * **Current behaviour (placeholder):** Logs the event and returns a
 * success indicator without making a real HTTP request. Once the
 * Botpress API URL and token are configured, replace the body of this
 * function with an actual `fetch` call:
 *
 * ```ts
 * const config = getBotpressConfig();
 * const res = await fetch(`${config.apiUrl}/events`, {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     Authorization: `Bearer ${config.apiToken}`,
 *   },
 *   body: JSON.stringify({ type: eventType, payload }),
 * });
 * return { success: res.ok };
 * ```
 *
 * @param eventType - A string identifying the event (e.g. "booking_confirmed").
 * @param payload   - An arbitrary key-value object with event-specific data.
 * @returns A promise resolving to `{ success: boolean }`.
 */
export async function sendBotpressEvent(
  eventType: string,
  payload: BotpressEventPayload
): Promise<{ success: boolean }> {
  // TODO: Replace with real API call once BOTPRESS_API_URL and BOTPRESS_API_TOKEN are set.
  console.log(`[Botpress] Event "${eventType}" prepared`, payload);
  return { success: true };
}

/**
 * Creates a structured conversation context object that can be
 * attached to a Botpress conversation (e.g., as user variables or
 * sent as an initial event payload).
 *
 * This is useful when you want the bot to know which service or
 * specialist the user was browsing before starting a chat.
 *
 * @param data - Partial info about the user's session.
 * @param data.service    - The name or ID of the dental service.
 * @param data.specialist - The name or ID of the specialist.
 * @param data.userName   - The user's display name.
 * @returns A ConversationContext object ready to be sent to Botpress.
 */
export function createConversationContext(data: {
  service?: string;
  specialist?: string;
  userName?: string;
}): ConversationContext {
  return {
    service: data.service ?? null,
    specialist: data.specialist ?? null,
    userName: data.userName ?? null,
    locale: 'es_CO',
    timestamp: new Date().toISOString(),
  };
}
