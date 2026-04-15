# Botpress Import (Booking v2)

Archivo listo para importar:

- `backend/botpress/healthy-teeth-bot-booking-v2.json`

## Qué cambió en `wf-main`

1. Nodo `nd-e63252fc1b` (`Standard2`)
- Reemplazado el código por llamada a `POST /api/bot/booking/turn`.
- Guarda estado en `user.bookingState`.
- Escribe la respuesta final en `workflow.respuesta`.

2. Transición de `Standard2`
- Ahora va directo a `nd-99a1c4c1be` (nodo de envío de mensaje).

3. Nodo `nd-99a1c4c1be` (`Standard4`)
- Sigue enviando `{{workflow.respuesta}}`.
- Ahora termina el turno (`defaultTransition: null`).

4. Nodo IA `nd-7a0343fea6`
- Queda sin uso en la ruta principal (bypass).

## Importante antes de publicar

En el nodo `Standard2`, cambia:

```js
const apiBase = 'https://TU_BACKEND_PUBLICO';
```

por la URL pública real de tu backend (dominio o ngrok HTTPS activo).

Si dejas `localhost`, Botpress Cloud no podrá conectarse.
