# 🦷 Healthy Teeth Clinic

Aplicación web full-stack para la gestión de una clínica odontológica.
Incluye sitio público, agendamiento de citas y panel administrativo con API REST.

---

## 🚀 Demo

* 🌐 Frontend: *(pendiente despliegue)*
* ⚙️ Backend API: *(pendiente despliegue)*
* 📄 Documentación API (Swagger): `/api/docs`

---

## 🏗️ Arquitectura

Este proyecto sigue una arquitectura **cliente-servidor desacoplada**:

* **Frontend:** SPA con SSR usando Next.js (App Router)
* **Backend:** API REST con NestJS
* **Base de datos:** MongoDB (Atlas)

```text
Cliente (Next.js) ---> API REST (NestJS) ---> MongoDB
```

---

## 🧩 Tecnologías

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* React Hook Form + Zod

### Backend

* NestJS 11
* TypeScript
* Mongoose
* class-validator

### Infraestructura

* MongoDB Atlas
* Vercel (recomendado)
* Render / Railway (backend)

---

## 📁 Estructura del proyecto

```text
healthyTeethClinic/
├── frontend/                # Aplicación web (Next.js)
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── backend/                 # API REST (NestJS)
│   ├── src/modules/
│   ├── src/common/
│   └── package.json
└── README.md
```

---

## ⚙️ Instalación

### Requisitos

* Node.js 20+
* npm 10+
* MongoDB (local o Atlas)

### Clonar repositorio

```bash
git clone https://github.com/davidhd709/healthyTeethClinic.git
cd healthyTeethClinic
```

### Instalar dependencias

```bash
cd frontend && npm install
cd ../backend && npm install
```

---

## 🔐 Variables de entorno

### Backend (`backend/.env`)

Crea un archivo `.env` basado en `.env.example`:

```env
MONGODB_URI=<your_mongodb_connection_string>
PORT=4000
CORS_ORIGIN=http://localhost:3000

ADMIN_EMAIL=<your_admin_email>
ADMIN_PASSWORD=<your_secure_password>

ADMIN_TOKEN_SECRET=<your_secure_secret>
ADMIN_TOKEN_TTL_SECONDS=28800
```

---

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_BOTPRESS_CLIENT_ID=
NEXT_PUBLIC_BOTPRESS_WEBCHAT_URL=https://cdn.botpress.cloud/webchat/v2.2/shareable.html

BOTPRESS_API_URL=
BOTPRESS_API_TOKEN=
```

---

## ▶️ Ejecución en desarrollo

### Backend

```bash
cd backend
npm run dev
```

* API: http://localhost:4000
* Swagger: http://localhost:4000/api/docs

---

### Frontend

```bash
cd frontend
npm run dev
```

* Web: http://localhost:3000

---

## 📡 Endpoints principales

### Públicos

* `GET /api/services`
* `GET /api/specialists`
* `GET /api/availability`
* `POST /api/appointments`
* `POST /api/contact`

### Autenticación

* `POST /api/auth/login`

### Administración (requiere token)

* `POST|PUT|DELETE /api/services`
* `POST|PUT|DELETE /api/specialists`
* `GET|PUT|DELETE /api/appointments`
* `GET /api/contact`

---

## 🧠 Funcionalidades

* ✅ Gestión de servicios odontológicos
* ✅ Gestión de especialistas
* ✅ Agendamiento de citas (wizard paso a paso)
* ✅ Validación de disponibilidad en tiempo real
* ✅ Panel administrativo protegido
* ✅ API documentada con Swagger

---

## 🔒 Seguridad

* Uso de variables de entorno para credenciales sensibles
* Autenticación basada en token para administración
* Validación de datos en backend (class-validator)
* Sanitización de inputs en frontend y backend

> ⚠️ **Importante:**
> Nunca subas archivos `.env` al repositorio.
> Configura las variables de entorno directamente en tu proveedor de despliegue.

---

## 🧪 Scripts útiles

### Backend

```bash
npm run dev
npm run build
npm run start
npm run start:prod
npm run seed
```

### Frontend

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## 🚀 Despliegue

### Frontend (recomendado)

* Vercel

### Backend

* Render
* Railway

### Base de datos

* MongoDB Atlas

---

## 🛠️ Troubleshooting

### Error de conexión a MongoDB

* Verificar `MONGODB_URI`
* Permitir IP en MongoDB Atlas
* Validar conexión de red

---

### Frontend no conecta con backend

* Verificar:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

* Reiniciar servidor frontend

---

## 📌 Estado del proyecto

* ✅ Frontend compilando correctamente
* ✅ Backend funcional
* ✅ API documentada
* 🚧 Pendiente despliegue en producción

---

## 👨‍💻 Autor

Desarrollado por **Henry David**
Estudiante de Ingeniería de Sistemas

---

## 📄 Licencia

Este proyecto es de uso académico y demostrativo.
