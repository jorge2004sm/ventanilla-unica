# Ventanilla Única — Backend

Backend del sistema **Ventanilla Única**, plataforma multitenant de gestión de citas presenciales y trámites administrativos para organizaciones de atención al público (ayuntamientos, administraciones).

Desarrollado como proyecto de evaluación de prácticas en **InnovaSur**.

## 🧩 Stack

- **NestJS** — framework backend con inyección de dependencias
- **TypeORM** — ORM para MySQL
- **MySQL** — base de datos relacional (Docker)
- **JWT + Passport + bcrypt** — autenticación y seguridad
- **class-validator + class-transformer** — validación de DTOs
- **Swagger** — documentación de la API en `/api`
- **Multer** — subida real de archivos

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura hexagonal** (Ports & Adapters):

```
src/
├── application/      
│   └── use-cases/      # Lógica de negocio (9 use-cases)
├── auth/               # JWT strategy, guards, decoradores        
├── domain/             
│   ├── dto/            # DTOs con class-validator + @ApiProperty
│   ├── entities/       # Entidades puras de dominio (sin TypeORM)
│   ├── enums/          # EstadoCita, EstadoTramite, TipoVacacion, etc.
│   └── interfaces/     # Contratos de repositorio (ports)
└── infrastructure/
    ├── controllers/    # 9 controllers REST (adapters)
    ├── database/       # Seed inicial con superadmin definido
    ├── persistence/    # ORM entities + repositorios TypeORM (adapters)
    └── services/       # Servicio recibido por n8n para la automatizacion externa

```

### Inyección de dependencias

Los use-cases inyectan repositorios mediante strings directos:

```typescript
@Inject('ICitaRepository')
private readonly citaRepository: ICitaRepository
```

Registrados en `app.module.ts`:

```typescript
{ provide: 'ICitaRepository', useClass: CitaTypeOrmRepository }
```

## 📦 Modelo de datos

11 entidades: `tenants`, `roles`, `usuarios`, `salas`, `mesas`, `citas`, `tipos_tramite`, `tramites`, `documentos`, `vacaciones`, `horarios`

### Enums

- **EstadoCita**: pendiente, completada, no_presentado_ciudadano, no_presentado_empleado, cancelada
- **EstadoTramite**: pendiente, en_proceso, completado, rechazado, cancelado
- **EstadoVacacion**: pendiente, aprobada, rechazada
- **TipoVacacion**: vacaciones, baja_medica, asuntos_propios
- **TipoHorario**: base, especial
- **DiaSemana**: lunes, martes, miercoles, jueves, viernes, sabado, domingo
- **Rol**: superadmin, admin, empleado, ciudadano

## 🔌 Endpoints

- `POST /auth/login` — login ciudadanos
- `POST /auth/acceso` — login staff
- `POST /auth/registro` — registro ciudadanos
- `/tenants` — CRUD superadmin (GET público)
- `/usuarios` — CRUD admin/superadmin
- `/citas` — POST público, GET/PATCH con auth y roles, reasignación, disponibilidad
- `/tramites` — gestión de trámites + subida de documentos con multer
- `/vacaciones` — solicitar, aprobar/rechazar, citas afectadas
- `/horarios` — base, especiales, festivos (GET público, POST/PATCH protegido)
- `/salas` — CRUD salas
- `/mesas` — CRUD mesas
- `/tipos-tramite` — CRUD tipos de trámite

## ⚙️ Reglas de negocio

- Citas máximo 7 días desde la fecha actual
- Vacaciones tipo "vacaciones" deben solicitarse con mínimo 14 días de antelación
- Asignación automática de empleado libre al crear cita
- Password con bcrypt (salt 10), `select: false` en la columna
- JWT expira en 24h
- CORS habilitado para `http://localhost:4200`

## 🚀 Arranque del proyecto

El proyecto completo (MySQL + backend + frontend + n8n) se levanta con Docker Compose:

```bash
docker compose up --build    # primera vez o tras cambios en código
docker compose up            # siguientes veces
docker compose up -d         # en segundo plano
```

### Servicios

- **MySQL** en `localhost:3306` (seed automático con datos iniciales)
- **Backend (NestJS)** en `localhost:3000`
- **Frontend (nginx)** en `localhost:4200`
- **n8n** en `localhost:5678` (automatizaciones)
- **Swagger** en `http://localhost:3000/api`

### Estructura Docker

ventanilla-unica-backend/
├── Dockerfile
├── .dockerignore
├── docker-compose.yml        # Orquesta los 3 servicios
├── database/
│   └── seed.sql              # BD exportada con datos
└── src/

El frontend se construye desde su propio Dockerfile (multi-stage con nginx) y se referencia en el `docker-compose.yml`.

### Credenciales por defecto

- **Staff**: acceso desde `/acceso`.
- **Superadmin**: `superadmin@ventanillaunica.com` / `SuperAdmin123!`
- **Administrador**: `admin@granada.es` / `Admin123!`
- **Empleado**: `ventanillaunicatest2026@gmail.com` / `Empleado123!`
- **Ciudadanos**: registro desde `/registro`

### Desarrollo sin Docker

```bash
npm install
npm run start:dev
```

Requiere Node.js 18+, npm 9+ y una instancia MySQL accesible con las variables de entorno configuradas.

## 🌳 Flujo de trabajo

- **GitFlow**: `main` ← `develop` ← `feature/*` ← `release/*`
- **Conventional Commits** vinculados a issues (`Relates to #N`, `Closes #N`)
- **Merge Requests** a `develop` para revisión
- **Versionado semántico**: v0.1.0 (Hito 1 — Diseño e implementación básica)

## 🤖 Automatizaciones (n8n)

El backend integra un `NotificacionService` que, al crear una cita, envía los datos a un webhook de **n8n** para automatizar el flujo post-reserva:

**Flujo n8n:**

1. **Webhook** — recibe los datos de la cita desde el backend
2. **HTTP Request** — obtiene la ubicación del tenant vía Google Maps API
3. **AI Agent (OpenAI)** — genera el contenido del email de confirmación
4. **Convert HTML to PDF** — genera un PDF con el resumen de la cita
5. **HTTP Request** — obtiene datos adicionales necesarios
6. **Send Confirmation Email (Gmail)** — envía el email con el PDF adjunto al ciudadano
7. **Create an event (Google Calendar)** — crea un evento en el calendario del empleado asignado

El servicio es no bloqueante: si n8n no está disponible o la URL no está configurada, el backend registra un warning y continúa sin interrumpir la creación de la cita.

n8n corre como servicio self-hosted en Docker dentro del `docker-compose.yml`, con un volumen persistente para flujos y credenciales. La URL del webhook se configura con la variable de entorno `N8N_WEBHOOK_URL`.

### Configuración de credenciales n8n

Tras levantar el proyecto por primera vez, es necesario configurar las credenciales en `http://localhost:5678`:

- **Gmail** — OAuth2 con proyecto de Google Cloud Console (Gmail API habilitada)
- **Google Calendar** — OAuth2 con el mismo proyecto (Calendar API habilitada)
- **OpenAI** — API key
- **Google Maps** — API key (Geocoding API habilitada)

## 🧪 Testing

Tests unitarios con Jest para los 9 use-cases del backend:

```bash
npm run test
```

Cobertura: validación de fechas, festivos, horarios, asignación de empleados, permisos por rol, regla de 14 días en vacaciones, reasignación de citas, CRUD con control de acceso.
