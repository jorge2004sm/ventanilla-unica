# Ventanilla Única — Frontend

Frontend del sistema **Ventanilla Única**, plataforma multitenant de gestión de citas presenciales y trámites administrativos para organizaciones de atención al público (ayuntamientos, administraciones).

Desarrollado como proyecto de evaluación de prácticas en **InnovaSur**.

## 🧩 Stack

- **Angular 17+** (standalone components, signals, routing con lazy loading)
- **Tailwind CSS 3** — estilado utility-first con color corporativo `#448192`
- **ng2-charts + Chart.js** — gráficas del dashboard admin
- **TypeScript**

## 🔗 Backend

Este repositorio contiene únicamente el frontend. Consume la API REST del backend NestJS de Ventanilla Única.

- URL por defecto: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/api`
- Configurable desde `src/environments/environment.ts`

## 🚀 Arranque del proyecto

El proyecto completo (MySQL + backend + frontend) se levanta con un único comando desde el repositorio del backend:

```bash
cd ventanilla-unica-backend
docker compose up --build
```

### Servicios

- **MySQL** en `localhost:3306` (seed automático con datos iniciales)
- **Backend (NestJS)** en `localhost:3000`
- **Frontend (nginx)** en `localhost:4200`
- **Swagger** en `http://localhost:3000/api`

### Credenciales por defecto

- **Staff**: acceso desde `/acceso`.
- **Superadmin**: `superadmin@ventanillaunica.com` / `SuperAdmin123!`
- **Administrador**: `admin@granada.es` / `Admin123!`
- **Empleado**: `ventanillaunicatest2026@gmail.com` / `Empleado123!`
- **Ciudadanos**: registro desde `/registro`

### Desarrollo sin Docker

Si necesitas trabajar solo en el frontend sin Docker:

```bash
npm install
npm start
```

Requiere Node.js 18+, npm 9+ y el backend corriendo en `http://localhost:3000`.

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/          # Servicios singleton, guards, interceptores, modelos
│   ├── layouts/       # Layouts con navbar y con sidebar
│   └── features/      # Módulos funcionales por área
│       ├── admin/
│       ├── ciudadano/
│       ├── empleado/
│       ├── public/
│       ├── staff/
│       └── superadmin/
├── environments/      # Configuración por entorno (apiUrl, etc.)
└── styles.css         # Tailwind + estilos globales
```

## 👥 Roles y áreas

La aplicación distingue cuatro roles con áreas diferenciadas:

- **Ciudadano** — solicitud de citas (stepper de 4 pasos con disponibilidad en tiempo real) y consulta de historial.
- **Empleado** — gestión de citas diarias, cambio de estado, subida de documentos y solicitud de vacaciones.
- **Admin** — dashboard con métricas y gráficas, gestión de citas (con reasignación), empleados, salas y mesas, horarios (base, especiales, festivos), tipos de trámite y aprobación de vacaciones con reasignación de citas afectadas.
- **Superadmin** — gestión global de tenants y usuarios del sistema.

## 🔐 Autenticación

- Dos puntos de acceso: `/login` (ciudadanos) y `/acceso` (staff)
- JWT almacenado en localStorage, inyectado vía interceptor HTTP
- Estado global con Angular Signals (`AuthService`)
- Guards funcionales: `authGuard` (sesión) y `roleGuard` (rol)
- Logout automático en respuestas 401

## 📱 Responsive

- Área pública y ciudadano: diseño responsive completo
- Áreas administrativas: diseño desktop-only

## 🌳 Flujo de trabajo

- **GitFlow**: `main` ← `develop` ← `feature/*` ← `release/*`
- **Conventional Commits** vinculados a issues (`Relates to #N`, `Closes #N`)
- **Merge Requests** a `develop` para revisión
- **Versionado semántico**: v0.3.0 (Hito 3 — Frontend)

## 🧪 Testing

Tests unitarios con Vitest para servicios, guards y lógica de componentes:

```bash
npx vitest run
```

Cobertura: autenticación (localStorage, token, roles), guards (sesión y rol), interceptor (JWT, logout en 401), generación de slots horarios, validaciones (DNI, teléfono, email), detección de festivos.