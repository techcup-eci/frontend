# Proyecto Final: TECHCUP FÚTBOL
**Escuela Colombiana de Ingeniería Julio Garavito - DOSW**

## 1. Objetivo
Aplicar las diferentes fases del ciclo de vida del desarrollo de software a partir de un caso de estudio práctico y real, permitiendo a los estudiantes apropiar los temas vistos en clase.

---

## 2. Reglas del Proyecto

### Sobre el Equipo de Trabajo
* **Composición**: Equipos de 4 o 5 personas.
* **Permanencia**: Los grupos no podrán disolverse ni modificarse a lo largo del semestre.
* **Cancelaciones**: Si un integrante cancela la materia, el alcance y criterios de calificación no se alteran.

### Herramientas y Metodología
* **Estructura**: Debe construirse con **Maven**.
* **Versionamiento**: Uso de **GitHub** con correcta gestión de ramas y archivos `.gitignore`.
* **Planeación**: Se realizará en **Jira**.
* **Framework**: **Scrum + Kanban** con sprints de una semana.
* **Arquitectura**: Uso obligatorio de patrones de diseño.

---

## 3. Cronograma e Hitos (Tercer Tercio: Semanas 13 a 16)

| Hito | Semana | Actividad | Responsable |
| :--- | :--- | :--- | :--- |
| **1** | 13 (Lab) | Entrega de enunciado y distribución de dominios funcionales . | Profesor  |
| **2-4** | 13 | Diseño frontend, herramientas de arquitectura, creación de Jira y GitHub. | Estudiantes  |
| **5** | 14 (Asínc) | **Sprint 1**: Levantamiento de requerimientos y diseños de arquitectura. | Estudiantes  |
| **6** | 14 (Lab) | Implementación 1, Sprint Review 1 y Planeación Sprint 2. | Estudiantes y Profesor  |
| **7** | 15 (Asínc) | Implementación Sprint 2. | Estudiantes  |
| **8** | 15 (Lab) | Sprint Review 2, Planeación Sprint 3 y preparación presentación final. | Estudiantes y Profesor  |
| **9** | 16 (Lab) | Sprint Review 3 y Presentación Final. | Estudiantes y Profesor  |

---

## 4. Descripción del Sistema

### Problema
La gestión actual del torneo es manual (WhatsApp, formularios aislados y hojas de cálculo), lo que genera desorden en inscripciones, pagos, resultados y estadísticas.

### Solución
**TECHCUP FÚTBOL**: Una plataforma web centralizada para gestionar el torneo de forma organizada y transparente para estudiantes, capitanes y organizadores.

### Actores del Sistema
* **Estudiante / Graduado / Profesor / Administrativo**: Puede ser jugador y capitán.
* **Familiares**: Jugador o invitado; puede ser capitán .
* **Capitán**: Crea y administra un equipo.
* **Organizador**: Administra el torneo.
* **Árbitro**: Visualiza información de partidos asignados .
* **Administrador**: Control total del sistema.

---

## 5. Arquitectura Funcional (Microservicios)

1.  **Servicio de Identidad**: Gestión de autenticación, generación de JWT, roles (invitado, jugador, capitán, organizador, árbitro, administrador) y auditoría.
2.  **Servicio de Usuarios y Jugadores**: Perfiles deportivos (posición, dorsal, foto) y gestión de invitaciones a equipos.
3.  **Servicio de Equipos**: Creación de equipos (7 a 12 jugadores), validación de dorsales y pertenencia de miembros a programas de ingeniería.
4.  **Servicio de Torneos**: Registro de torneos, gestión de estados (Borrador, Activo, En Progreso, Finalizado), cargue de reglamentos y validación de pagos.
5.  **Servicio de Competencia**: Gestión de partidos, alineaciones (formaciones como 3-2-1, 2-3-1, etc.), registro de resultados (goles, tarjetas) y tablas de posiciones automáticas.
6.  **Servicio Orquestador (API Gateway)**: Punto único de entrada, enrutamiento de solicitudes, validación básica de tokens y manejo de errores.

---

## 6. Arquitectura Tecnológica

* **Backend**: **Spring Boot** (arquitectura por capas: controladores, adaptadores, lógica y datos).
* **API**: REST.
* **Frontend**: **React** con **TypeScript**.
* **Base de Datos**: **PostgreSQL**.
* **Almacenamiento de Imágenes**: **MongoDB**.

---

## 7. Comparativa: Identidad vs. Orquestador

| Aspecto | Servicio de Identidad | Orquestador |
| :--- | :---: | :---: |
| Login | ✅ | ❌ |
| Generar JWT | ✅ | ❌ |
| Validar JWT | ✅ (completo) | ✅ (básico) |
| Roles y permisos | ✅ | ❌ |
| Usuarios | ✅ | ❌ |
| Bloquear requests sin token | ❌ | ✅ |
| Lógica de seguridad | ✅ | ❌ |

---

## 8. Impacto Esperado
* Eliminar la organización manual.
* Facilitar la participación y brindar claridad en reglas/fechas.
* Automatizar resultados y conservar un historial del torneo.