# Análisis Funcional y Técnico
## Descripción del proyecto
**Ventanilla Única** es una plataforma web multitenant para gestionar citas presenciales y trámites entre ciudadanos y empleados de organizaciones. El sistema permite a ciudadanos solicitar citas asociadas a tipos de trámite, y a los empleados gestionar sus citas, trámites, vacaciones y horarios desde un área privada.

## Actores de sistema
#### Ciudadano
- Selecciona la organización (tenant) y el tipo de trámite que necesita.
- Solicita citas a través de un formulario público
- Recibe confirmación con la sala y mesa asignada
- Puede registrarse e iniciar sesión para acceder a la plataforma, lo que permite almacenar sus datos y no tener que rellenarlos cada vez
- Puede subir documentos asociados a su trámite


#### Empleado
- Accede al área privada con autenticación 
- Gestiona sus citas pendientes
- Gestiona los trámites asociados a sus citas (actualizar estado, añadir observaciones)
- Puede atender citas de otros empleados si estos no estan disponibles
- Solicita días de vacaciones o bajas

#### Administrador
- Todas las funciones del empleado
- Gestiona usuarios (crear, editar, desactivar empleados)
- Asigna empleados a mesas y salas
- Configura los tipos de trámite disponibles en su organización
- Aprueba o rechaza solicitudes de vacaciones
- Configura horarios (base, especiales y festivos)
- Gestiona salas y mesas 

#### Superadministrador
- Gestiona los tenants (organizaciones)
- Crea y asigna administradores a cada tenant
- Da de alta y baja usuarios en los tenants

## Requisitos Funcionales
| ID | Requisito | Descripción |
|:---|:---|:---|
| RF01 | Solicitud de citas | El ciudadano selecciona tenant, trámite, fecha y hora. Asignación automática de empleado. Máximo 7 días a futuro. |
| RF02 | Gestión de citas | Cambio de estados y reasignación por administrador si el empleado no está disponible. |
| RF03 | Tipos de trámite | Configuración de trámites con descripción y requisitos documentales por parte del admin. |
| RF04 | Gestión de trámites | Actualización de estado (pendiente, en proceso, completado, rechazado) y observaciones por el empleado. |
| RF05 | Gestión de documentos | Carga de archivos asociados a un trámite por parte de ciudadano o empleado. |
| RF06 | Asignación empleado-mesa | El admin vincula empleados a salas/mesas. La cita hereda la ubicación del empleado. |
| RF07 | Gestión de horarios | Calendario con soporte para horarios base y periodos especiales (verano, navidad). |
| RF08 | Vacaciones y Bajas | Solicitud de días libres (2 semanas antelación). Bajas médicas con impacto inmediato en agenda. |
| RF09 | Salas y Mesas | Creación de salas con número de mesas configurable por organización. |
| RF10 | Gestión de usuarios | CRUD de empleados, asignación de roles y estados de cuenta. |
| RF11 | Registro ciudadano | Permite al ciudadano guardar sus datos para agilizar trámites futuros. |
| RF12 | Tenants | Aislamiento lógico de datos entre organizaciones y gestión global. |

## Requisitos Técnicos
### Backend
- **Framework:** NestJS (Node.js)
- **Base de datos:** MySQL
- **ORM:** TypeORM
- **Arquitectura:** Hexagonal (Domain / Application / Infrastructure)
- **Seguridad:** Autenticación JWT y validación mediante DTOs (class-validator)
- **Documentación:** Swagger
- **Contenedores:** Docker para base de datos

### Frontend
- **Framework:** Angular
- **Estilos:** Tailwind CSS
- **Formularios:** Reactive Forms de Angular
- **Routing:** Guards para control de acceso por rol
- **Interceptores:** Para adjuntar JWT en las peticiones HTTP

### Infraestructura
- **Control de Versiones:** Git con metodología GitFlow
- **Repositorio:** GitLab
- **Despliegue:** Docker Compose

## Restricciones de negocio
| Restricción | Descripción |
| :--- | :--- |
- **Límite de citas:** Solo se pueden solicitar citas en un margen de 7 días vista.
- **Antelación Vacaciones:** Mínimo 2 semanas de antelación para solicitudes estándar.
- **Bajas médicas:** Sin restricción de antelación, pero afectan inmediatamente a las citas asignadas.
- **Asignación de mesas:** El administrador asigna empleados a mesas; la cita hereda esta ubicación.
- **Modificación de citas:** Restringido al empleado asignado o al administrador.
- **Horarios especiales:** Prevalecen sobre el horario base en periodos concretos.
- **Festivos:** Bloqueo total de solicitudes de cita en días no laborables.
- **Privacidad Tenant:** Los datos son estrictamente invisibles entre diferentes organizaciones.
- **Acceso Libre:** El registro no es requisito para el uso básico del ciudadano.
- **Duración de citas:** Configurable por tenant (valor por defecto: 30 minutos).