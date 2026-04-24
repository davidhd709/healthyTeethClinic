# Healthy Teeth Clinic — Roadmap de Evolución

> Documento vivo. Se actualiza al iniciar, avanzar o cerrar cada fase.
> Objetivo: convertir la app actual (agenda + dashboard + servicios + especialistas) en un sistema odontológico profesional completo.

**Última actualización:** 2026-04-24
**Estado global:** Fases 0 y 1 completadas — Listo para iniciar Fase 2 (Pacientes)

---

## Leyenda de estados

| Símbolo | Significado |
|---|---|
| `[ ]` | Tarea pendiente |
| `[x]` | Tarea completada |
| `[~]` | Tarea en progreso |
| `[!]` | Tarea bloqueada |
| `[-]` | Tarea cancelada o diferida |

**Estado por fase:** `Pendiente` · `En progreso` · `Completada` · `Bloqueada` · `Diferida`

---

## Stack confirmado

| Capa | Tecnología |
|---|---|
| Backend | NestJS 11 + Mongoose (MongoDB) |
| Frontend | Next.js 16 (App Router) + React 19 |
| UI | shadcn/ui + Radix + Tailwind v4 |
| Estado | Zustand 5 |
| Validación | React Hook Form + Zod |
| Auth | JWT Bearer (extendiendo el actual) |
| Calendario | FullCalendar (MIT) |
| Gráficos | recharts |
| PDF | pdfkit |
| Archivos adjuntos | Cloudinary |
| Correo | Nodemailer + Gmail (ya existente) |
| Integraciones existentes | Google Calendar, Google Sheets, Botpress (se respetan) |

---

## Decisiones arquitectónicas aprobadas

### D1. Auth multi-rol con retrocompatibilidad
- Admin del `.env` sigue funcionando como **superusuario** (god mode, nunca se invalida).
- Nueva colección `users` con roles: `admin | specialist | receptionist`.
- Login busca primero en `users`; si no encuentra, cae al admin `.env`.
- Payload JWT incluye `role` y `userId` (si falta `role` en tokens viejos → se asume `admin`).

### D2. Patient como entidad + snapshot en Appointment
- Nueva colección `patients`.
- `Appointment` gana campo opcional `patientId`; los campos legacy (`patientName`, `patientEmail`, `patientDocument`, `patientPhone`) **se mantienen** como snapshot histórico. Nada se borra.
- Migración idempotente: por cada appointment sin `patientId`, crear/vincular paciente por `documentNumber`.

### D3. Odontograma — un documento por paciente
- Colección `odontograms`: 1 documento por paciente con array embebido de 32 dientes permanentes (FDI).
- Cada `ToothRecord` tiene subdocumento `surfaces` con 5 superficies (`vestibular`, `lingual_palatal`, `mesial`, `distal`, `occlusal_incisal`).
- Colección separada `odontogram_history` **append-only** e inmutable para auditoría.
- Lectura de odontograma completo = 1 query. Escrituras = updates posicionales atómicos.

### D4. Exportación PDF con pdfkit
- No requiere Chromium. Más liviano que puppeteer.
- Usado en Fase 7 para exportar historia clínica y reportes.

### D5. Archivos adjuntos en Cloudinary
- Desde el inicio (no se pasa por almacenamiento local).
- `@cloudinary/url-gen` + firma server-side.
- Referencias en `Procedure`, `MedicalHistory`, `ClinicalEvolution`, `Odontogram`.

### D6. Borrado lógico obligatorio
- Entidades clínicas (`Patient`, `MedicalHistory`, `Odontogram`, `Procedure`) nunca se borran físicamente.
- Todas tienen `isActive: boolean` y `deletedAt?: Date`.

### D7. Audit trail
- Entidades clínicas registran `createdBy` y `updatedBy` (userId del JWT).

---

## Fases

---

### Fase 0 — Preparación transversal

**Estado:** Completada
**Inicio:** 2026-04-24
**Fin:** 2026-04-24
**Depende de:** nada
**Bloquea a:** todas las demás

Objetivo: base común (roles, guards, hooks de auth) que usan todas las fases.

#### Archivos nuevos
- [x] `backend/src/common/guards/roles.guard.ts`
- [x] `backend/src/common/decorators/roles.decorator.ts`
- [x] `backend/src/common/decorators/current-user.decorator.ts`
- [x] `backend/src/common/types/jwt-payload.type.ts`
- [x] `frontend/src/hooks/useAuth.ts`
- [x] `frontend/src/hooks/usePermissions.ts`
- [x] `frontend/src/lib/permissions.ts`
- [x] `frontend/src/lib/jwt.ts`

#### Archivos modificados
- [x] `backend/src/common/utils/admin-token.util.ts` — payload incluye `role` y `userId`
- [x] `backend/src/common/guards/admin.guard.ts` — adjunta `user` al request (retrocompatible)
- [x] `backend/src/modules/auth/auth.service.ts` — retorna role en respuesta de login
- [x] `backend/src/modules/auth/auth.controller.ts` — añade `GET /api/auth/me`
- [x] `frontend/src/components/admin/AdminSidebar.tsx` — filtrado de ítems por rol, logout via hook

#### Notas
- Retrocompatible: tokens existentes sin `role` se tratan como `admin` (en backend y frontend).
- Nada del comportamiento actual cambia para un usuario que ya tiene sesión abierta.
- Backend: `npm run build` pasa. Frontend: `npx tsc --noEmit` pasa.
- `RolesGuard` reconoce `admin` como superusuario (pasa cualquier `@Roles(...)`).
- Matriz de permisos centralizada en `frontend/src/lib/permissions.ts` con 16 permisos iniciales.

---

### Fase 1 — Usuarios y roles

**Estado:** Completada
**Inicio:** 2026-04-24
**Fin:** 2026-04-24
**Depende de:** Fase 0
**Bloquea a:** Fases 2, 3, 4, 5 (todo lo clínico necesita permisos)

Objetivo: multi-usuario con roles `admin | specialist | receptionist`.

#### Backend — archivos nuevos
- [x] `backend/src/modules/users/users.module.ts`
- [x] `backend/src/modules/users/users.controller.ts`
- [x] `backend/src/modules/users/users.service.ts`
- [x] `backend/src/modules/users/schemas/user.schema.ts`
- [x] `backend/src/modules/users/dto/create-user.dto.ts`
- [x] `backend/src/modules/users/dto/update-user.dto.ts`
- [x] `backend/src/modules/users/dto/query-user.dto.ts`
- [x] `backend/src/scripts/migrate-admin-user.ts` — crea admin `.env` en `users` si no existe (idempotente)
- [x] `backend/src/common/utils/password.util.ts` — hashing con scrypt nativo (sin dep nueva)

#### Backend — archivos modificados
- [x] `backend/src/app.module.ts` — registra `UsersModule`
- [x] `backend/src/modules/auth/auth.module.ts` — importa `UsersModule`
- [x] `backend/src/modules/auth/auth.service.ts` — login busca en `users`, fallback a admin `.env`
- [x] `backend/src/modules/auth/auth.controller.ts` — endpoint `GET /api/auth/me` (ya hecho en Fase 0)
- [x] `backend/package.json` — script `migrate:admin`

#### Frontend — archivos nuevos
- [x] `frontend/src/app/admin/usuarios/page.tsx` (una sola page con modal, consistente con el patrón actual de admin)
- [x] `frontend/src/components/admin/UserForm.tsx`
- [x] `frontend/src/components/admin/UserTable.tsx`
- [-] `frontend/src/app/admin/usuarios/nuevo/page.tsx` — descartado (modal en page principal)
- [-] `frontend/src/app/admin/usuarios/[id]/editar/page.tsx` — descartado (modal en page principal)

#### Frontend — archivos modificados
- [x] `frontend/src/components/admin/AdminSidebar.tsx` — ítem "Usuarios" solo para admin (filtrado por `users.manage`)
- [x] `frontend/src/types/index.ts` — interfaces `IUser`, re-export `UserRole`
- [x] `frontend/src/hooks/useAuth.ts` — refactor a `useSyncExternalStore` (React 19 idiomatic)

#### Criterios de aceptación
- [x] Admin puede crear/editar/inactivar usuarios.
- [x] Usuarios creados pueden iniciar sesión (verificado vía compilación; pending test manual con MongoDB).
- [x] Admin `.env` sigue funcionando sin estar en BD (fallback en `AuthService`).
- [x] Sidebar muestra ítems según rol.
- [x] Salvaguarda: no se puede desactivar/eliminar al último admin activo.
- [x] `passwordHash` nunca sale al cliente (`select: false` + `toJSON` transform).

---

### Fase 2 — Gestión avanzada de pacientes

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fase 1
**Bloquea a:** Fases 3, 4, 5

Objetivo: CRUD completo de pacientes con perfil por pestañas.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/patients/patients.module.ts`
- [ ] `backend/src/modules/patients/patients.controller.ts`
- [ ] `backend/src/modules/patients/patients.service.ts`
- [ ] `backend/src/modules/patients/schemas/patient.schema.ts`
- [ ] `backend/src/modules/patients/dto/create-patient.dto.ts`
- [ ] `backend/src/modules/patients/dto/update-patient.dto.ts`
- [ ] `backend/src/modules/patients/dto/query-patient.dto.ts`
- [ ] `backend/src/scripts/migrate-appointments-to-patients.ts`

#### Backend — archivos modificados
- [ ] `backend/src/app.module.ts` — registra `PatientsModule`
- [ ] `backend/src/modules/appointments/schemas/appointment.schema.ts` — añade `patientId?` (opcional, no rompe citas viejas)
- [ ] `backend/src/modules/appointments/appointments.service.ts` — al crear cita, resuelve/crea paciente por documento

#### Frontend — archivos nuevos
- [ ] `frontend/src/app/admin/pacientes/page.tsx` — listado con búsqueda y filtros
- [ ] `frontend/src/app/admin/pacientes/nuevo/page.tsx`
- [ ] `frontend/src/app/admin/pacientes/[id]/page.tsx` — perfil con tabs
- [ ] `frontend/src/app/admin/pacientes/[id]/editar/page.tsx`
- [ ] `frontend/src/components/patients/PatientForm.tsx`
- [ ] `frontend/src/components/patients/PatientCard.tsx`
- [ ] `frontend/src/components/patients/PatientProfileTabs.tsx`
- [ ] `frontend/src/components/patients/PatientsTable.tsx`
- [ ] `frontend/src/components/patients/PatientFilters.tsx`
- [ ] `frontend/src/components/patients/PatientSummary.tsx`
- [ ] `frontend/src/lib/validations/patient.schema.ts` — Zod

#### Frontend — archivos modificados
- [ ] `frontend/src/components/admin/AdminSidebar.tsx` — ítem "Pacientes"
- [ ] `frontend/src/types/index.ts` — `IPatient`

#### Criterios de aceptación
- [ ] Documento único por paciente.
- [ ] Edad calculada automáticamente a partir de fecha de nacimiento.
- [ ] Búsqueda por nombre/documento/teléfono/correo funciona.
- [ ] Citas previas del paciente aparecen en su pestaña "Citas".
- [ ] No se eliminan pacientes físicamente; solo `isActive=false`.

---

### Fase 3 — Historia clínica y evoluciones

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fase 2

Objetivo: ficha médica por paciente con evoluciones cronológicas.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/medical-histories/medical-histories.module.ts`
- [ ] `backend/src/modules/medical-histories/medical-histories.controller.ts`
- [ ] `backend/src/modules/medical-histories/medical-histories.service.ts`
- [ ] `backend/src/modules/medical-histories/schemas/medical-history.schema.ts`
- [ ] `backend/src/modules/medical-histories/schemas/clinical-evolution.schema.ts`
- [ ] `backend/src/modules/medical-histories/dto/update-medical-history.dto.ts`
- [ ] `backend/src/modules/medical-histories/dto/create-evolution.dto.ts`

#### Backend — archivos modificados
- [ ] `backend/src/app.module.ts`
- [ ] `backend/src/modules/patients/patients.service.ts` — crea historia clínica vacía al crear paciente

#### Frontend — archivos nuevos
- [ ] `frontend/src/components/medical-history/MedicalHistoryTabs.tsx`
- [ ] `frontend/src/components/medical-history/MedicalHistoryForm.tsx`
- [ ] `frontend/src/components/medical-history/ClinicalEvolutionForm.tsx`
- [ ] `frontend/src/components/medical-history/EvolutionTimeline.tsx`
- [ ] `frontend/src/lib/validations/medical-history.schema.ts`

#### Frontend — archivos modificados
- [ ] `frontend/src/components/patients/PatientProfileTabs.tsx` — integra historia clínica

#### Criterios de aceptación
- [ ] Cada paciente tiene automáticamente una historia clínica.
- [ ] Se pueden agregar múltiples evoluciones con fecha y especialista.
- [ ] La historia clínica no se elimina físicamente.
- [ ] Solo admin y specialist pueden editarla; recepcionista solo lectura.

---

### Fase 4 — Odontograma clínico interactivo (fase central)

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fase 2

Objetivo: odontograma FDI interactivo, por diente y superficie, persistente.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/odontograms/odontograms.module.ts`
- [ ] `backend/src/modules/odontograms/odontograms.controller.ts`
- [ ] `backend/src/modules/odontograms/odontograms.service.ts`
- [ ] `backend/src/modules/odontograms/schemas/odontogram.schema.ts`
- [ ] `backend/src/modules/odontograms/schemas/tooth-record.schema.ts`
- [ ] `backend/src/modules/odontograms/schemas/tooth-surface-record.schema.ts`
- [ ] `backend/src/modules/odontograms/schemas/odontogram-history.schema.ts`
- [ ] `backend/src/modules/odontograms/dto/update-tooth.dto.ts`
- [ ] `backend/src/modules/odontograms/dto/update-surface.dto.ts`
- [ ] `backend/src/modules/odontograms/constants/fdi-teeth.constant.ts`
- [ ] `backend/src/modules/odontograms/constants/tooth-status.constant.ts`

#### Backend — archivos modificados
- [ ] `backend/src/app.module.ts`

#### Frontend — archivos nuevos
- [ ] `frontend/src/components/odontogram/OdontogramView.tsx`
- [ ] `frontend/src/components/odontogram/DentalArch.tsx`
- [ ] `frontend/src/components/odontogram/ToothItem.tsx`
- [ ] `frontend/src/components/odontogram/ToothSurfaceSelector.tsx`
- [ ] `frontend/src/components/odontogram/ToothDetailPanel.tsx`
- [ ] `frontend/src/components/odontogram/ToothTreatmentForm.tsx`
- [ ] `frontend/src/components/odontogram/OdontogramLegend.tsx`
- [ ] `frontend/src/components/odontogram/ToothHistoryTable.tsx`
- [ ] `frontend/src/lib/odontogram/fdi-teeth.ts`
- [ ] `frontend/src/lib/odontogram/status-catalog.ts`
- [ ] `frontend/src/lib/odontogram/surface-geometry.ts`
- [ ] `frontend/src/lib/validations/odontogram.schema.ts`
- [ ] `frontend/src/types/odontogram.ts`

#### Criterios de aceptación
- [ ] Se muestran 32 dientes permanentes con numeración FDI correcta.
- [ ] Cada diente es clickeable y abre panel lateral.
- [ ] Cada diente permite marcar 5 superficies.
- [ ] Al guardar un tratamiento, el diente cambia visualmente.
- [ ] Cada cambio queda registrado en `odontogram_history` (append-only).
- [ ] Solo admin y specialist pueden modificar; recepcionista solo lectura.
- [ ] La leyenda muestra los 27 estados clínicos del brief.

---

### Fase 5 — Procedimientos odontológicos

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fases 2, 4

Objetivo: registro transversal de procedimientos vinculado a paciente/diente/superficie/cita/servicio.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/procedures/procedures.module.ts`
- [ ] `backend/src/modules/procedures/procedures.controller.ts`
- [ ] `backend/src/modules/procedures/procedures.service.ts`
- [ ] `backend/src/modules/procedures/schemas/procedure.schema.ts`
- [ ] `backend/src/modules/procedures/dto/create-procedure.dto.ts`
- [ ] `backend/src/modules/procedures/dto/update-procedure.dto.ts`
- [ ] `backend/src/modules/procedures/dto/query-procedure.dto.ts`

#### Backend — archivos modificados
- [ ] `backend/src/modules/odontograms/odontograms.service.ts` — sync al marcar procedimiento como `completed`

#### Frontend — archivos nuevos
- [ ] `frontend/src/components/procedures/ProcedureForm.tsx`
- [ ] `frontend/src/components/procedures/ProcedureTimeline.tsx`
- [ ] `frontend/src/components/procedures/ProcedureTable.tsx`
- [ ] `frontend/src/components/procedures/ProcedureFilters.tsx`
- [ ] `frontend/src/lib/validations/procedure.schema.ts`

#### Frontend — archivos modificados
- [ ] `frontend/src/components/patients/PatientProfileTabs.tsx` — tab "Procedimientos"
- [ ] `frontend/src/components/odontogram/ToothDetailPanel.tsx` — acceso a procedimientos del diente

#### Criterios de aceptación
- [ ] Procedimientos pueden crearse desde paciente, historia, odontograma o cita.
- [ ] Estados: `planned`, `in_progress`, `completed`, `cancelled`.
- [ ] Al completar un procedimiento dental, el odontograma se actualiza solo.

---

### Fase 6 — Calendario visual de citas

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fase 1 (roles)

Objetivo: calendario día/semana/mes con FullCalendar respetando la tabla actual.

#### Backend — archivos modificados
- [ ] `backend/src/modules/appointments/appointments.controller.ts` — filtros de rango + `PATCH /:id/status`
- [ ] `backend/src/modules/appointments/appointments.service.ts` — validación de solapamiento, duración por servicio
- [ ] `backend/src/modules/appointments/schemas/appointment.schema.ts` — añadir estados `en_atencion`, `no_asistio`

#### Frontend — archivos nuevos
- [ ] `frontend/src/app/admin/calendario/page.tsx`
- [ ] `frontend/src/components/calendar/AppointmentCalendar.tsx`
- [ ] `frontend/src/components/calendar/AppointmentModal.tsx`
- [ ] `frontend/src/components/calendar/CalendarFilters.tsx`
- [ ] `frontend/src/components/calendar/AppointmentQuickActions.tsx`

#### Frontend — archivos modificados
- [ ] `frontend/src/components/admin/AdminSidebar.tsx` — ítem "Calendario"
- [ ] `frontend/src/app/admin/citas/page.tsx` — botón "Ver calendario" (tabla se conserva)

#### Dependencias npm a agregar
- [ ] `@fullcalendar/react`
- [ ] `@fullcalendar/daygrid`
- [ ] `@fullcalendar/timegrid`
- [ ] `@fullcalendar/interaction`

#### Criterios de aceptación
- [ ] Vista día/semana/mes funcional.
- [ ] Filtros por especialista/servicio/estado/paciente.
- [ ] Drag&drop para reprogramar (solo admin y recepcionista).
- [ ] No se permiten solapamientos.
- [ ] La vista tabular `/admin/citas` sigue funcionando sin cambios.

---

### Fase 7 — Dashboard mejorado y reportes

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fases 2, 5, 6

Objetivo: KPIs, gráficos y reportes exportables.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/reports/reports.module.ts`
- [ ] `backend/src/modules/reports/reports.controller.ts`
- [ ] `backend/src/modules/reports/reports.service.ts`
- [ ] `backend/src/modules/reports/dto/report-filters.dto.ts`
- [ ] `backend/src/modules/reports/exporters/pdf.exporter.ts`
- [ ] `backend/src/modules/reports/exporters/excel.exporter.ts`

#### Frontend — archivos nuevos
- [ ] `frontend/src/app/admin/reportes/page.tsx`
- [ ] `frontend/src/components/dashboard/DashboardStats.tsx`
- [ ] `frontend/src/components/dashboard/charts/AppointmentsByWeek.tsx`
- [ ] `frontend/src/components/dashboard/charts/AppointmentsByStatus.tsx`
- [ ] `frontend/src/components/dashboard/charts/ProceduresByMonth.tsx`
- [ ] `frontend/src/components/dashboard/charts/TopServices.tsx`
- [ ] `frontend/src/components/dashboard/charts/RevenueByService.tsx`
- [ ] `frontend/src/components/dashboard/QuickActions.tsx`
- [ ] `frontend/src/components/reports/ReportFilters.tsx`
- [ ] `frontend/src/components/reports/ReportTable.tsx`

#### Frontend — archivos modificados
- [ ] `frontend/src/app/admin/dashboard/page.tsx` — reemplaza "Analytics coming soon"
- [ ] `frontend/src/components/admin/AdminSidebar.tsx` — ítem "Reportes"

#### Dependencias npm a agregar
- [ ] `recharts`
- [ ] `pdfkit` + `@types/pdfkit`
- [ ] `exceljs`

#### Criterios de aceptación
- [ ] Dashboard muestra KPIs del brief (hoy, pendientes, confirmadas, etc.).
- [ ] Gráficos reales reemplazan "coming soon".
- [ ] Reportes filtrables por fecha/especialista/servicio.
- [ ] Exportación a PDF y Excel.

---

### Fase 8 — Mejoras a servicios y especialistas

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fase 1

Objetivo: ampliar campos del brief sin romper lo existente (cambios aditivos).

#### Backend — archivos modificados
- [ ] `backend/src/modules/services/schemas/service.schema.ts` — `category`, `preRecommendations`, `postRecommendations`
- [ ] `backend/src/modules/services/dto/create-service.dto.ts`
- [ ] `backend/src/modules/services/dto/update-service.dto.ts`
- [ ] `backend/src/modules/specialists/schemas/specialist.schema.ts` — `documentId`, `phone`, `email`, `experienceYears`
- [ ] `backend/src/modules/specialists/dto/create-specialist.dto.ts`
- [ ] `backend/src/modules/specialists/dto/update-specialist.dto.ts`

#### Frontend — archivos modificados
- [ ] `frontend/src/app/admin/servicios/page.tsx` — formulario extendido
- [ ] `frontend/src/app/admin/especialistas/page.tsx` — formulario extendido

#### Frontend — archivos nuevos
- [ ] `frontend/src/components/specialists/SpecialistCalendar.tsx` — vista de calendario del especialista
- [ ] `frontend/src/components/specialists/SpecialistProcedures.tsx`
- [ ] `frontend/src/components/services/ServiceAppointments.tsx`

#### Criterios de aceptación
- [ ] Todos los campos nuevos son opcionales para datos existentes.
- [ ] Formularios actuales siguen funcionando con datos parciales.

---

### Fase 9 — Archivos adjuntos con Cloudinary

**Estado:** Pendiente
**Inicio:** —
**Fin:** —
**Depende de:** Fases 3, 4, 5

Objetivo: subida de radiografías, fotos y documentos a Cloudinary.

#### Backend — archivos nuevos
- [ ] `backend/src/modules/attachments/attachments.module.ts`
- [ ] `backend/src/modules/attachments/attachments.controller.ts`
- [ ] `backend/src/modules/attachments/attachments.service.ts`
- [ ] `backend/src/modules/attachments/schemas/attachment.schema.ts`
- [ ] `backend/src/modules/attachments/dto/create-attachment.dto.ts`
- [ ] `backend/src/modules/attachments/cloudinary.provider.ts`

#### Frontend — archivos nuevos
- [ ] `frontend/src/components/attachments/AttachmentUploader.tsx`
- [ ] `frontend/src/components/attachments/AttachmentGallery.tsx`
- [ ] `frontend/src/lib/cloudinary.ts`

#### Variables de entorno nuevas
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

#### Criterios de aceptación
- [ ] Subida firmada desde backend (API secret nunca sale del server).
- [ ] Galería en tabs "Archivos" de paciente y procedimientos.
- [ ] Tamaño máximo validado.
- [ ] Tipos permitidos: jpg, png, pdf, dicom.

---

## Reglas transversales (aplicadas en cada fase)

- [ ] **Borrado lógico** obligatorio en entidades clínicas.
- [ ] **Guards por rol** en cada endpoint nuevo con `@Roles(...)`.
- [ ] **DTOs con class-validator** para todo input backend.
- [ ] **Zod schemas** en frontend (double gate con backend).
- [ ] **Audit trail** (`createdBy`, `updatedBy`) en entidades clínicas.
- [ ] **Índices únicos:** `patients.documentNumber`, `users.email`.
- [ ] **Sanitización:** trim + lowercase en emails.
- [ ] Confirmaciones modales antes de acciones destructivas.

---

## Historial de cambios

### 2026-04-24
- Plan inicial aprobado por el usuario.
- Decisiones arquitectónicas D1-D7 confirmadas.
- Stack complementario elegido: FullCalendar, recharts, pdfkit, Cloudinary.
- Roadmap creado.
- **Fase 0 completada:**
  - JWT extendido con `role` y `userId` (retrocompatible con tokens antiguos).
  - `RolesGuard` nuevo con admin como superusuario + decorators `@Roles(...)` y `@CurrentUser()`.
  - `AdminGuard` ahora adjunta `user` al request (sin romper endpoints existentes).
  - `GET /api/auth/me` expone el usuario autenticado.
  - Frontend: `useAuth`, `usePermissions`, matriz de 16 permisos, decodificador JWT client-side.
  - Sidebar filtra ítems por permiso; logout centralizado en hook.
  - Backend build OK. Frontend type-check OK.
- **Fase 1 completada:**
  - Módulo `users` completo: schema con `passwordHash`, DTOs, service con CRUD + borrado lógico + salvaguarda de último admin.
  - Hashing con `scrypt` nativo de Node (sin dependencia nueva).
  - `AuthService` ahora consulta `users` primero, con fallback al admin `.env` (superusuario intacto).
  - Script idempotente `npm run migrate:admin` para poblar el admin del `.env` en la colección `users`.
  - Frontend: `UserForm`, `UserTable`, página `/admin/usuarios` con modal (consistente con `/admin/especialistas`).
  - Sidebar: ítem "Usuarios" visible solo para admin.
  - `useAuth` refactorizado a `useSyncExternalStore` para cumplir con las reglas de React 19.
  - Backend build OK. Frontend lint + type-check OK (0 errores introducidos).

---

## Próximos pasos

1. Iniciar **Fase 0** (preparación transversal — base de roles).
2. Continuar con **Fase 1** (usuarios y roles).
3. Avanzar secuencialmente hasta **Fase 9**.

> Al comenzar cada fase, cambiar su estado a `En progreso` y anotar fecha de inicio.
> Al terminarla, marcar `Completada`, anotar fecha de fin y registrar cambios relevantes en el historial.
