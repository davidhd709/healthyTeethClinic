# Healthy Teeth Clinic

Plataforma web profesional para una clínica odontológica premium. Permite mostrar servicios, especialistas, agendar citas online, consultar disponibilidad y gestionar la clínica desde un panel administrativo.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 16** (App Router) | Framework full-stack |
| **TypeScript** | Tipado estático |
| **Tailwind CSS v4** | Estilos |
| **shadcn/ui** | Componentes UI |
| **MongoDB Atlas** | Base de datos |
| **Mongoose** | ODM para MongoDB |
| **React Hook Form + Zod** | Formularios y validación |
| **date-fns** | Manejo de fechas |
| **lucide-react** | Iconografía |
| **Sonner** | Notificaciones toast |

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx                    # Landing / Home
│   ├── layout.tsx                  # Layout raíz
│   ├── servicios/                  # Servicios (listado + detalle)
│   ├── especialistas/              # Especialistas (listado + perfil)
│   ├── agendar/                    # Agendamiento de citas
│   ├── disponibilidad/             # Disponibilidad de horarios
│   ├── contacto/                   # Página de contacto
│   ├── admin/                      # Panel administrativo
│   │   ├── login/                  # Login admin
│   │   ├── dashboard/              # Dashboard
│   │   ├── servicios/              # CRUD servicios
│   │   ├── especialistas/          # CRUD especialistas
│   │   └── citas/                  # Gestión de citas
│   └── api/                        # API Routes
│       ├── services/               # CRUD servicios
│       ├── specialists/            # CRUD especialistas
│       ├── appointments/           # CRUD citas
│       ├── availability/           # Consulta de disponibilidad
│       ├── auth/                   # Autenticación admin
│       ├── contact/                # Mensajes de contacto
│       ├── seed/                   # Seed de datos demo
│       └── botpress/webhook/       # Webhook Botpress
├── components/
│   ├── ui/                         # Componentes shadcn/ui
│   ├── layout/                     # Navbar, Footer
│   ├── shared/                     # Componentes reutilizables
│   ├── booking/                    # Wizard de agendamiento
│   ├── availability/               # Explorador de disponibilidad
│   ├── contact/                    # Formulario de contacto
│   ├── admin/                      # Sidebar admin
│   └── botpress/                   # Integración Botpress
├── models/                         # Modelos Mongoose
├── lib/                            # Utilidades, conexión DB, validaciones
├── types/                          # Tipos TypeScript
└── hooks/                          # Custom hooks
```

## Instalación y Configuración

### 1. Clonar e instalar dependencias

```bash
git clone <repo-url>
cd healthyTeethClinic
npm install
```

### 2. Configurar MongoDB Atlas

1. Crear una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito (M0)
3. Crear un usuario de base de datos
4. Agregar tu IP a la lista de acceso (o `0.0.0.0/0` para desarrollo)
5. Obtener la cadena de conexión (connection string)

### 3. Variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales:

```env
# MongoDB Atlas - Reemplazar con tu connection string real
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_PASSWORD@tu-cluster.mongodb.net/healthy-teeth-clinic?retryWrites=true&w=majority

# URL del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Credenciales admin (demo)
ADMIN_EMAIL=admin@healthyteethclinic.com
ADMIN_PASSWORD=admin123

# Botpress (opcional - ver sección Botpress)
BOTPRESS_BOT_ID=
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=
NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL=https://cdn.botpress.cloud/webchat/v2.2/shareable.html
BOTPRESS_API_URL=
BOTPRESS_API_TOKEN=
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

### 5. Cargar datos de demostración

Una vez la app esté corriendo, cargar los datos seed:

```bash
curl -X POST http://localhost:3000/api/seed
```

O desde el panel admin: ir a `/admin/login`, ingresar con las credenciales demo, y en el Dashboard hacer clic en "Seed Database".

## Páginas y Funcionalidades

### Sitio Público

| Página | Ruta | Descripción |
|---|---|---|
| Home | `/` | Landing con hero, servicios, especialistas, testimonios, FAQ |
| Servicios | `/servicios` | Catálogo de servicios odontológicos |
| Detalle Servicio | `/servicios/[slug]` | Detalle completo del servicio |
| Especialistas | `/especialistas` | Equipo de odontólogos |
| Perfil Especialista | `/especialistas/[slug]` | Perfil completo con horarios |
| Agendar Cita | `/agendar` | Wizard de 5 pasos para reservar cita |
| Disponibilidad | `/disponibilidad` | Explorador interactivo de horarios |
| Contacto | `/contacto` | Formulario e información de contacto |

### Panel Administrativo

| Página | Ruta | Descripción |
|---|---|---|
| Login | `/admin/login` | Autenticación admin |
| Dashboard | `/admin/dashboard` | Estadísticas y acciones rápidas |
| Servicios | `/admin/servicios` | CRUD completo de servicios |
| Especialistas | `/admin/especialistas` | CRUD completo de especialistas |
| Citas | `/admin/citas` | Gestión y filtrado de citas |

### Credenciales Admin (Demo)

- **Email:** `admin@healthyteethclinic.com`
- **Password:** `admin123`

## Flujo de Agendamiento

El corazón de la aplicación es el wizard de agendamiento en 5 pasos:

1. **Seleccionar Servicio** - Elegir entre los servicios disponibles
2. **Seleccionar Especialista** - Ver especialistas que ofrecen el servicio
3. **Seleccionar Fecha y Hora** - Calendario con disponibilidad real
4. **Datos del Paciente** - Formulario validado con datos personales
5. **Confirmar Cita** - Resumen y confirmación

El sistema previene doble reserva en el mismo horario con el mismo especialista.

## API Endpoints

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Listar servicios activos |
| POST | `/api/services` | Crear servicio |
| GET/PUT/DELETE | `/api/services/[id]` | Operaciones sobre servicio |
| GET | `/api/specialists` | Listar especialistas activos |
| POST | `/api/specialists` | Crear especialista |
| GET/PUT/DELETE | `/api/specialists/[id]` | Operaciones sobre especialista |
| GET | `/api/appointments` | Listar citas (soporta filtros) |
| POST | `/api/appointments` | Crear cita |
| GET/PUT/DELETE | `/api/appointments/[id]` | Operaciones sobre cita |
| GET | `/api/availability?specialistId=...&date=...` | Consultar disponibilidad |
| POST | `/api/auth` | Login admin |
| POST | `/api/contact` | Enviar mensaje de contacto |
| POST | `/api/seed` | Cargar datos demo |
| POST | `/api/botpress/webhook` | Webhook para Botpress |

## Integración con Botpress

La aplicación está preparada para integrarse con [Botpress](https://botpress.com/) para atención conversacional.

### Activar Botpress Webchat

1. Crear un bot en [Botpress Cloud](https://app.botpress.cloud/)
2. Obtener el **Client ID** del bot
3. Configurar las variables en `.env.local`:

```env
NEXT_PUBLIC_BOTPRESS_CLIENT_ID=tu-client-id-de-botpress
NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL=https://cdn.botpress.cloud/webchat/v2.2/shareable.html
```

4. Reiniciar el servidor. El botón de chat flotante aparecerá automáticamente.

### Integración futura con API de Botpress

Los siguientes archivos están preparados para conectar funcionalidades avanzadas:

- **`src/lib/botpress.ts`** - Funciones utilitarias para comunicación con Botpress API
- **`src/app/api/botpress/webhook/route.ts`** - Webhook para recibir eventos del bot
- **`src/components/botpress/BotpressProvider.tsx`** - Proveedor de contexto para enviar datos al bot

#### Capacidades preparadas:

1. **FAQ automatizadas** - El bot puede responder preguntas frecuentes sobre procedimientos
2. **Orientación de servicios** - Guiar al paciente hacia el servicio adecuado
3. **Inicio de agendamiento** - Redirigir al formulario de citas con contexto pre-cargado
4. **Contexto de página** - Enviar al bot información del servicio/especialista que el usuario está viendo

### Configurar Webhook en Botpress

1. En tu bot de Botpress, ir a Integrations > Webhooks
2. Configurar la URL: `https://tu-dominio.com/api/botpress/webhook`
3. Configurar los eventos que deseas escuchar

Para más detalles, ver comentarios en `src/app/api/botpress/webhook/route.ts`.

## Despliegue

### Vercel (Recomendado)

1. Conectar repositorio en [Vercel](https://vercel.com)
2. Configurar variables de entorno en el dashboard de Vercel
3. Deploy automático

### Variables de entorno en producción

Asegurarse de configurar TODAS las variables de `.env.example` en el proveedor de hosting.

## Datos de Demo

Los datos seed incluyen:

- **10 servicios** odontológicos con descripciones, duración y precios
- **8 especialistas** con diferentes especialidades, biografías y horarios semanales
- **6 testimonios** realistas de pacientes

## Comandos

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

## Tecnologías y Decisiones de Arquitectura

- **App Router** de Next.js para routing basado en archivos y Server Components
- **Server Components** para páginas que consultan la base de datos (SEO, performance)
- **Client Components** para interactividad (wizard de booking, filtros, admin)
- **Mongoose** como ODM para modelos estructurados con validación de esquema
- **Zod** para validación de formularios en cliente y servidor
- **shadcn/ui** para componentes UI consistentes y accesibles
- **Diseño responsive** mobile-first con Tailwind CSS
- **Paleta premium** de azul clínico y turquesa para transmitir confianza y salud
