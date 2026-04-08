# Healthy Teeth Clinic

Aplicacion web para una clinica odontologica con:

- Sitio publico (servicios, especialistas, disponibilidad, contacto)
- Wizard de agendamiento de citas
- Panel administrativo (login, dashboard, gestion de servicios/especialistas/citas)
- API REST en NestJS + MongoDB

## Arquitectura actual

Este repositorio esta dividido en 2 apps:

- `frontend/`: Next.js 16 (App Router)
- `backend/`: NestJS 11 + Mongoose

El frontend consume la API del backend por HTTP (`NEXT_PUBLIC_API_URL`).

## Stack

- Frontend: Next.js, React 19, TypeScript, Tailwind v4, shadcn/ui, Zod, React Hook Form
- Backend: NestJS, TypeScript, Mongoose, class-validator
- DB: MongoDB Atlas (o instancia Mongo compatible)

## Estructura

```text
healthyTeethClinic/
├── frontend/
│   ├── src/app/                  # rutas publicas y admin
│   ├── src/components/           # UI y componentes de negocio
│   ├── src/lib/                  # helpers (api, validaciones, fechas)
│   └── package.json
├── backend/
│   ├── src/modules/              # auth, services, specialists, appointments, etc.
│   ├── src/common/               # guards, pipes, filtros, utils
│   └── package.json
└── README.md
```

## Requisitos

- Node.js 20+ (recomendado)
- npm 10+
- MongoDB accesible desde tu equipo

## Instalacion

Desde la raiz del proyecto:

```bash
cd frontend && npm install
cd ../backend && npm install
```

## Variables de entorno

### Backend (`backend/.env`)

Crea `backend/.env` con este contenido base:

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/healthy-teeth-clinic?retryWrites=true&w=majority
PORT=4000
CORS_ORIGIN=http://localhost:3000

ADMIN_EMAIL=admin@healthyteethclinic.com
ADMIN_PASSWORD=admin123

# Firma de token admin (obligatorio en entornos reales)
ADMIN_TOKEN_SECRET=change-this-secret-in-production
# 8 horas
ADMIN_TOKEN_TTL_SECONDS=28800
```

Notas:

- `JWT_SECRET` no es necesario para el flujo actual (se usa token firmado propio).
- Asegura que tu IP tenga acceso en MongoDB Atlas.

### Frontend (`frontend/.env.local`)

Crea `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Botpress (opcional)
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=
NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL=https://cdn.botpress.cloud/webchat/v2.2/shareable.html
BOTPRESS_API_URL=
BOTPRESS_API_TOKEN=
```

## Ejecucion en desarrollo

Abre 2 terminales:

### Terminal 1 - Backend

```bash
cd backend
npm run dev
```

API: `http://localhost:4000`  
Swagger: `http://localhost:4000/api/docs`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Web: `http://localhost:3000`

## Scripts utiles

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
npm run start:prod
npm run seed
```

### Frontend

```bash
cd frontend
npm run dev
npm run lint
npm run build
npm run start
```

## Endpoints principales (backend)

Base URL: `http://localhost:4000`

- `POST /api/auth/login`
- `GET /api/services`
- `GET /api/specialists`
- `GET /api/availability?specialistId=...&date=YYYY-MM-DD`
- `POST /api/appointments`
- `POST /api/contact`

Endpoints de administracion (requieren `Authorization: Bearer <admin_token>`):

- `POST|PUT|DELETE /api/services`
- `POST|PUT|DELETE /api/specialists`
- `GET|PUT|PATCH|DELETE /api/appointments`
- `GET /api/contact`
- `POST /api/seed`

## Credenciales admin demo

- Email: `admin@healthyteethclinic.com`
- Password: `admin123`

## Flujo de agendamiento

1. Servicio
2. Especialista
3. Fecha y hora
4. Datos del paciente
5. Confirmacion

El sistema valida:

- campos requeridos
- formato de fecha/hora
- disponibilidad
- conflicto de agenda (mismo especialista, fecha, hora)

## Troubleshooting rapido

### 1) Error `Cannot find module .../backend/dist/main`

Ejecuta:

```bash
cd backend
rm -rf dist tsconfig.build.tsbuildinfo
npm run build
npm run start
```

### 2) `ECONNREFUSED` o error al conectar Mongo

- Revisa `MONGODB_URI`
- Verifica whitelist de IP en Atlas
- Verifica conectividad DNS/red

### 3) Frontend no consume backend

- Revisa `frontend/.env.local`:
  - `NEXT_PUBLIC_API_URL=http://localhost:4000`
- Reinicia `npm run dev` del frontend tras cambiar variables

## Estado del proyecto

Validado localmente:

- `frontend`: `npm run lint` y `npm run build` OK
- `backend`: `npm run build` OK
