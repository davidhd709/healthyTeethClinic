import { NextRequest, NextResponse } from 'next/server';

/**
 * Botpress Webhook Endpoint
 * -------------------------
 * This route receives incoming webhook events from Botpress Cloud.
 *
 * To connect this webhook:
 * 1. In the Botpress Cloud dashboard, go to your bot's Integrations.
 * 2. Add a "Webhook" integration (or use the built-in webhook trigger).
 * 3. Set the webhook URL to: https://<your-domain>/api/botpress/webhook
 * 4. (Optional) Add a shared secret in the Botpress dashboard and
 *    verify it here via the `x-bp-secret` header for security.
 *
 * Supported event types (extend as needed):
 * - booking_request  : The user wants to book an appointment through the bot.
 * - faq_query        : The bot is requesting an FAQ answer from the backend.
 * - specialist_info  : The bot is requesting details about a specialist.
 *
 * Each case currently returns a placeholder response. Replace the
 * placeholder logic with real database queries or service calls.
 */

interface BotpressWebhookEvent {
  type: string;
  payload: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BotpressWebhookEvent;
    const { type, payload } = body;

    // Optional: Validate a shared secret header for security.
    // const secret = request.headers.get('x-bp-secret');
    // if (secret !== process.env.BOTPRESS_WEBHOOK_SECRET) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    switch (type) {
      /**
       * booking_request
       * ---------------
       * Triggered when the bot collects enough information to create
       * an appointment. Expected payload fields:
       *   - patientName: string
       *   - service: string
       *   - preferredDate: string (ISO 8601)
       *   - specialistId?: string
       *
       * TODO: Validate the payload with Zod, create the appointment
       * via the Appointment model, and return the confirmation.
       */
      case 'booking_request':
        console.log('[Botpress Webhook] booking_request received:', payload);
        return NextResponse.json({
          status: 'received',
          message:
            'Solicitud de cita recibida. Un miembro del equipo la confirmara pronto.',
          data: {
            confirmationId: `TEMP-${Date.now()}`,
            estimatedResponse: '15 minutos',
          },
        });

      /**
       * faq_query
       * ---------
       * Triggered when the bot needs an answer to a frequently asked
       * question. Expected payload fields:
       *   - question: string
       *   - category?: string
       *
       * TODO: Query a FAQ collection in MongoDB or match against a
       * static list and return the answer text.
       */
      case 'faq_query':
        console.log('[Botpress Webhook] faq_query received:', payload);
        return NextResponse.json({
          status: 'received',
          message: 'Consulta recibida.',
          data: {
            answer:
              'Nuestro horario de atencion es de Lunes a Viernes de 7:00 AM a 7:00 PM y Sabados de 8:00 AM a 2:00 PM.',
            category: 'horario',
          },
        });

      /**
       * specialist_info
       * ---------------
       * Triggered when the bot needs to display information about a
       * specific specialist. Expected payload fields:
       *   - specialistId?: string
       *   - specialty?: string
       *
       * TODO: Query the Specialist model by ID or specialty and
       * return the matching records.
       */
      case 'specialist_info':
        console.log('[Botpress Webhook] specialist_info received:', payload);
        return NextResponse.json({
          status: 'received',
          message: 'Informacion del especialista.',
          data: {
            name: 'Dra. Maria Rodriguez',
            specialty: 'Ortodoncia',
            availability: 'Lunes, Miercoles y Viernes',
          },
        });

      default:
        console.warn(
          `[Botpress Webhook] Unknown event type: "${type}"`,
          payload
        );
        return NextResponse.json(
          {
            status: 'unknown_event',
            message: `Tipo de evento "${type}" no reconocido.`,
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Botpress Webhook] Error processing event:', error);
    return NextResponse.json(
      { error: 'Error al procesar el evento del webhook.' },
      { status: 500 }
    );
  }
}
