# Política de Versionado
## Modelo de ramas - GitFlow

Este proyecto sigue el modelo GitFlow para la gestión de ramas.

### Ramas principales
- master: Contiene el código estable y las versiones lanzadas. Solo recibe merges desde ramas release y hotfix.
- develop: Rama de integración donde se fusionan todas las features terminadas. Contiene el código más actual en desarrollo.

### Ramas de soporte
- feature/*: Se crean desde develop para desarrollar una funcionalidad concreta. Al terminar, se fusionan de vuelta a develop
- release/*: Se crean desde develop cuando se va a cerrar un hito. Permiten ajustes finales antes de fusionar en master y develop
- hotfix/*: Se crean desde master para correcciones urgentes en producción. Se fusionan en master y develop

### Flujo de trabajo
1. Crear rama feature desde develop
2. Trabajar y hacer commits en la feature
3. Fusionar en develop al terminar
4. Al cerrar un hito, crear rama release
5. Fusionar release en master y develop

## Versionado semántico
Se utiliza el formato vX.Y.Z

- X (Mayor): Cambios importantes o reestructuraciones del proyecto
- Y (Menor): Nuevas funcionalidades o hitos completados
- Z (Parche): Correcciones de errores o ajustes menores

## Versiones planificadas
**Version**     **Hito**    **Descripción**
| Versión | Hito | Descripción |
| :--- | :--- | :--- |
| v0.1.0 | Hito 1 | Diseño e implementación básica |
| v0.2.0 | Hito 2 | Backend |
| v0.3.0 | Hito 3 | Frontend |
| v1.0.0 | Hito 4 | Despliegue y presentación |

## Convención de commits
Los mensajes de commits siguen el formato:
    "tipo: descripcion breve"

### Tipos permitidos
| Tipo | Uso |
| :--- | :--- |
| **feat** | Nueva funcionalidad |
| **fix** | Corrección de errores |
| **docs** | Cambios en documentación |
| **refactor** | Reestructuración de código sin cambiar funcionalidad |
| **style** | Cambios de formato (espacios, puntos y coma, etc) |
| **test** | Añadir o modificar tests |
| **chore** | Tareas de mantenimiento (dependencias, configuración) |
