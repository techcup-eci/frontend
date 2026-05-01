# PROMPT COMPLETO — Mockup TECHCUP FÚTBOL

---

## ROL Y OBJETIVO

Eres un experto en diseño UI/UX especializado en aplicaciones web deportivas. Tu tarea es diseñar los mockups de alta fidelidad de **todas las vistas** de una plataforma web llamada **TECHCUP FÚTBOL**.

Los mockups deben contener contenido real en español (no placeholders como "Lorem ipsum" ni "Usuario 1"). Usa nombres colombianos, equipos con nombres creativos relacionados con ingeniería, fechas del año 2025 y datos verosímiles del contexto universitario colombiano.

---

## CONTEXTO DEL SISTEMA

**TECHCUP FÚTBOL** es una plataforma web para gestionar el torneo semestral de fútbol de los programas de Ingeniería de Sistemas, Ingeniería de Inteligencia Artificial, Ingeniería de Ciberseguridad e Ingeniería Estadística de la **Escuela Colombiana de Ingeniería Julio Garavito** (Bogotá, Colombia).

El sistema reemplaza procesos manuales (WhatsApp, hojas de cálculo, formularios de Google) con un sistema centralizado. Los participantes pueden ser estudiantes, graduados, profesores, personal administrativo y familiares.

**Stack tecnológico:** React + TypeScript (frontend), Spring Boot (backend), PostgreSQL.

**Roles del sistema:**
| Rol | Descripción |
|---|---|
| Visitante | Puede ver información pública del torneo sin autenticarse |
| Jugador | Participa en el torneo como integrante de un equipo |
| Capitán | Crea y administra un equipo (también es jugador) |
| Organizador | Administra el torneo, partidos y resultados |
| Árbitro | Consulta sus partidos asignados y alineaciones |
| Administrador | Control total del sistema, usuarios y auditoría |

---

## IDENTIDAD VISUAL

- **Nombre:** TechCup Fútbol
- **Paleta principal:** Verde cancha oscuro `#1B5E35`, blanco `#FFFFFF`, negro `#0D0D0D`, acento naranja energético `#F97316`
- **Paleta secundaria:** Gris neutro `#6B7280`, verde claro `#4ADE80`, rojo para alertas `#EF4444`, amarillo para advertencias `#FACC15`
- **Tipografía:** Display deportiva en títulos y encabezados; fuente sans-serif moderna para cuerpos de texto y formularios
- **Estilo:** Moderno, limpio, deportivo, con toques tecnológicos. Uso de gradientes sutiles de verde oscuro a negro en headers. Cards con bordes redondeados. Iconografía de fútbol (balones, canchas, camisetas) usada con criterio, no de forma excesiva
- **Logo:** "TechCup" — combina un balón de fútbol con circuitos o nodos tecnológicos. Disponible en versión oscura y clara
- **Diseño:** Responsive. Los mockups deben mostrar principalmente la versión **desktop (1280px de ancho)**, pero mencionar las adaptaciones para móvil donde sea relevante

---

## SISTEMA DE COMPONENTES REUTILIZABLES

Antes de diseñar las vistas individuales, define estos componentes base que deben ser consistentes en toda la plataforma:

1. **Navbar superior:** Logo TechCup a la izquierda, nombre del usuario autenticado + badge de rol + avatar + botón "Cerrar sesión" a la derecha. El menú de navegación varía según el rol
2. **Menú lateral (sidebar):** Íconos + texto, ítem activo resaltado en verde, agrupado por secciones según rol
3. **Card de jugador:** Foto, nombre, posición, dorsal, equipo, badge de disponibilidad
4. **Card de equipo:** Escudo, nombre, capitán, cantidad de jugadores (ej. 8/12), estado de inscripción
5. **Card de partido:** Escudos de ambos equipos, marcador o "vs", fecha, hora, cancha, fase del torneo
6. **Badge de estado:** Colores estándar — Pendiente (gris), En revisión (amarillo), Aprobado (verde), Rechazado (rojo), Activo (verde), Borrador (gris), En progreso (azul), Finalizado (negro)
7. **Tabla de datos:** Headers con ordenamiento, filas alternas, paginación, buscador integrado
8. **Formulario estándar:** Labels encima de inputs, validación en línea con mensajes de error en rojo, botones primario (verde) y secundario (borde)
9. **Modal de confirmación:** Título, descripción de la acción, botón confirmar (rojo si es destructiva) y cancelar
10. **Notificación / Toast:** Éxito (verde), Error (rojo), Advertencia (amarillo), Info (azul)

---

## VISTAS A DISEÑAR

Diseña **todas** las siguientes vistas en el orden indicado. Para cada una especifica: nombre, rol(es) que la ven, componentes presentes, datos de ejemplo y estados especiales.

---

### SECCIÓN 1 — VISTAS PÚBLICAS (sin autenticación)

**VISTA 1 — Landing Page**
- Acceso: Visitante (y cualquier usuario no autenticado)
- Secciones:
  - Hero con nombre del torneo activo, fechas ("Torneo 2025-1 · 15 marzo – 30 mayo 2025"), botones CTA: "Regístrate" y "Ver el torneo"
  - Resumen del torneo: equipos inscritos (ej. 10 de 12 cupos), fase actual ("Fase de grupos")
  - Próximos partidos: 3 cards con equipos, fecha y cancha
  - Tabla de posiciones resumida (top 5): con columnas PJ, PG, PE, PP, Pts
  - Sección de estadísticas rápidas: máximo goleador, equipo líder
  - Footer con información de la Escuela Colombiana de Ingeniería y redes

**VISTA 2 — Registro de Usuario**
- Acceso: Visitante
- Formulario con campos: Nombre completo, Identificación (cédula/pasaporte), Correo electrónico (con validación de dominio: @escuelaing.edu.co o @gmail.com), Contraseña, Confirmar contraseña, Edad, Género (selector)
- Mensaje de validación visible: "Solo se aceptan correos @escuelaing.edu.co o @gmail.com"
- Enlace: "¿Ya tienes cuenta? Inicia sesión"
- Estado de error: mostrar mensajes en línea (ej. "Este correo ya está registrado", "La contraseña debe tener mínimo 8 caracteres")

**VISTA 3 — Inicio de Sesión**
- Acceso: Visitante
- Formulario: Correo, Contraseña, botón "Ingresar"
- Estado de error: "Credenciales incorrectas. Verifica tu correo y contraseña"
- Enlace: "¿No tienes cuenta? Regístrate"

---

### SECCIÓN 2 — VISTAS DEL JUGADOR

**VISTA 4 — Dashboard del Jugador**
- Sidebar con: Inicio, Mi Perfil, Mi Equipo, Torneo, Estadísticas
- Contenido principal:
  - Card de bienvenida: "Bienvenido, Sebastián" + badge rol "Jugador"
  - Card "Mi equipo": escudo, nombre del equipo, posición en tabla
  - Card "Próximo partido": rival, fecha, hora, cancha
  - Card "Estado de inscripción": badge de estado del pago del equipo
  - Feed de notificaciones recientes (ej. "Tu equipo fue aprobado para el torneo")

**VISTA 5 — Crear Perfil Deportivo**
- Formulario: Foto de perfil (upload con preview), Posición (selector: Portero, Defensa Central, Lateral Derecho, Lateral Izquierdo, Mediocampista Defensivo, Mediocampista Central, Extremo Derecho, Extremo Izquierdo, Delantero Centro), Dorsal preferido (número entre 1–99), Semestre actual (selector del 1 al 10)
- Validación visible: "El dorsal debe ser un número entre 1 y 99"
- Botones: "Guardar perfil" y "Cancelar"

**VISTA 6 — Editar Perfil Deportivo**
- Idéntica a Vista 5 pero con datos precargados
- Datos de ejemplo: Foto cargada, Posición: Mediocampista Central, Dorsal: 8, Semestre: 6
- Botones: "Actualizar perfil" y "Cancelar"

**VISTA 7 — Ver Mi Perfil**
- Tarjeta de jugador expandida: foto, nombre completo, correo, posición, dorsal, semestre, equipo actual, badge de disponibilidad ("Disponible" en verde / "No disponible" en rojo)
- Botón "Editar perfil"
- Sección "Estadísticas del torneo": goles marcados, partidos jugados, tarjetas amarillas, tarjetas rojas

**VISTA 8 — Marcar Disponibilidad**
- Calendario mensual con días seleccionables
- Leyenda de colores: Verde = Disponible, Rojo = No disponible, Amarillo = Por confirmar, Blanco = Sin definir
- Panel lateral con resumen de días marcados
- Botón "Guardar disponibilidad"

**VISTA 9 — Ver Equipos Disponibles (buscar equipo)**
- Buscador por nombre de equipo
- Filtros: Posición necesitada (selector), Estado del equipo
- Grid de cards de equipos con cupos abiertos
- Cada card muestra: escudo, nombre del equipo, capitán, cupos disponibles (ej. "3 cupos libres"), posiciones necesitadas (badges), botón "Ver equipo" y botón "Solicitar unirme"
- Estado vacío: "No hay equipos con cupos disponibles en este momento"

**VISTA 10 — Detalle de Equipo y Solicitud de Ingreso**
- Header del equipo: escudo, nombre, capitán, estado
- Lista de jugadores actuales con posición y dorsal
- Contador de cupos: "9 / 12 jugadores"
- Sección "¿Quieres unirte?" con botón "Enviar solicitud"
- Modal de confirmación: "¿Estás seguro de que quieres solicitar unirte a Los Algoritmos FC?"

**VISTA 11 — Ver Alineación de Mi Equipo**
- Representación visual de una cancha de fútbol (vista cenital, verde oscuro con líneas blancas)
- Jugadores titulares posicionados como fichas circulares con número de dorsal y nombre abreviado según la formación
- Panel lateral: formación elegida (ej. "4-3-3"), lista de reservas con foto y nombre
- Solo lectura para el jugador (sin arrastrar)
- Botón "Ver alineación del rival"

**VISTA 12 — Ver Alineación del Equipo Rival**
- Misma estructura que Vista 11 pero con datos del equipo contrario
- Header: nombre del rival, escudo, fecha del partido
- Solo lectura

---

### SECCIÓN 3 — VISTAS DEL CAPITÁN

**VISTA 13 — Crear Equipo**
- Formulario: Nombre del equipo (ej. "Los Algoritmos FC"), Escudo (upload de imagen con preview circular), Color institucional (selector de color), Descripción corta del equipo
- Vista previa del escudo en tiempo real
- Botón "Crear equipo"

**VISTA 14 — Dashboard del Capitán**
- Sidebar ampliado con: Inicio, Mi Equipo, Gestionar Jugadores, Buscar Jugadores, Pagos, Alineación, Torneo, Estadísticas
- Cards de resumen: jugadores en el equipo (9/12), solicitudes pendientes (2), estado del pago, próximo partido
- Alerta si el pago está pendiente: banner amarillo "Tu inscripción aún no ha sido aprobada. Sube el comprobante de pago"
- Feed de actividad del equipo

**VISTA 15 — Gestión del Equipo**
- Header: nombre del equipo, escudo, contador "9 / 12 jugadores"
- Tabla de jugadores: foto, nombre, posición, dorsal, estado, acciones (ver perfil, eliminar del equipo)
- Sección "Solicitudes de ingreso" (2 pendientes): card por solicitud con foto del jugador, posición y botones "Aceptar" / "Rechazar"
- Botón "Buscar jugadores" deshabilitado cuando el equipo tiene 12 jugadores con tooltip "El equipo está completo"

**VISTA 16 — Buscar Jugadores Libres**
- Filtros: Posición, Disponibilidad, Semestre
- Grid de cards de jugadores sin equipo
- Cada card: foto, nombre, posición, dorsal, semestre, badge de disponibilidad, botón "Invitar al equipo"
- Estado vacío: "No se encontraron jugadores disponibles con los filtros seleccionados"
- Estado de invitación enviada: botón cambia a "Invitación enviada ✓" (deshabilitado)

**VISTA 17 — Subir Comprobante de Pago**
- Información del pago: costo total del equipo (ej. "$80.000 COP"), instrucciones de pago (Nequi o efectivo al coordinador)
- Zona de carga: drag & drop o botón para subir imagen/PDF del comprobante
- Preview del comprobante cargado
- Badge de estado actual: grande y visible — Pendiente (gris) / En revisión (amarillo) / Aprobado (verde) / Rechazado (rojo)
- Si fue rechazado: mensaje de razón del rechazo y opción de subir nuevo comprobante
- Historial de comprobantes subidos anteriormente

**VISTA 18 — Configurar Alineación**
- Cancha de fútbol interactiva (drag & drop)
- Panel izquierdo: lista de jugadores del equipo con nombre, posición y dorsal
- Selector de formación en la parte superior (4-4-2, 4-3-3, 5-3-2, 3-5-2, etc.)
- Al seleccionar formación, los slots en la cancha se reposicionan automáticamente
- Fichas de jugadores arrastrables hacia los slots de la cancha
- Panel de reservas: jugadores que no están como titulares
- Botón "Guardar alineación" activo solo cuando todos los slots titulares están llenos
- Alerta: "Debes seleccionar exactamente 7 titulares y hasta 5 reservas"

---

### SECCIÓN 4 — VISTAS DEL ORGANIZADOR

**VISTA 19 — Dashboard del Organizador**
- Sidebar con: Inicio, Torneos, Equipos, Pagos, Partidos, Resultados, Calendario, Tabla de Posiciones, Llaves
- Cards de métricas: torneos activos (1), equipos inscritos (10/12), pagos pendientes de revisión (3), partidos esta semana (4)
- Sección "Acción requerida": lista de pagos pendientes de aprobar con acceso rápido
- Resumen del torneo activo: fase actual, fecha de cierre de inscripciones, próximo partido

**VISTA 20 — Crear Torneo**
- Formulario: Nombre del torneo (ej. "TechCup 2025-1"), Fecha de inicio (datepicker), Fecha de fin (datepicker), Cantidad de equipos (selector numérico, ej. 12), Costo por equipo (campo numérico en COP), Estado inicial (selector: Borrador / Activo), Fecha de cierre de inscripciones
- Botón "Crear torneo" y botón "Guardar como borrador"

**VISTA 21 — Configurar Torneo**
- Pestañas: General | Reglamento | Fechas importantes | Canchas | Sanciones
- Pestaña General: nombre, fechas, estado (con botón "Iniciar torneo" y "Finalizar torneo"), estadísticas básicas
- Pestaña Reglamento: editor de texto enriquecido con el reglamento completo (duración de partidos, número de jugadores, reglas especiales, etc.)
- Pestaña Fechas importantes: tabla de hitos con fecha y descripción (ej. "Cierre de inscripciones: 28 feb 2025")
- Pestaña Canchas: lista de canchas disponibles con nombre y ubicación, botón "Agregar cancha"
- Pestaña Sanciones: tabla de infracciones y consecuencias (tarjeta amarilla = 1 partido, tarjeta roja = 2 partidos, etc.)

**VISTA 22 — Gestión de Equipos Inscritos y Revisión de Pagos**
- Tabla de equipos: escudo, nombre, capitán, jugadores (9/12), estado de pago (badge), fecha de inscripción, acciones
- Al hacer clic en "Ver comprobante": panel lateral o modal con vista del documento subido, campos de razón de rechazo, botones "Aprobar" (verde) y "Rechazar" (rojo)
- Filtros: por estado de pago
- Contador: "3 pagos pendientes de revisión"

**VISTA 23 — Programar Partidos**
- Vista de calendario mensual con slots disponibles
- Panel lateral: selector de equipos (local y visitante), cancha, fecha, hora, árbitro asignado, fase del torneo
- Botón "Crear partido"
- Lista de partidos ya programados en la parte inferior: tabla con fecha, hora, cancha, equipos y fase

**VISTA 24 — Registrar Resultado de Partido**
- Header del partido: escudos, nombres de equipos, fecha y cancha
- Marcador: inputs grandes para goles del equipo local y visitante
- Sección "Goleadores": lista de jugadores de ambos equipos con input para cantidad de goles (0 por defecto), con buscador por nombre
- Sección "Tarjetas": selección de jugador + tipo de tarjeta (amarilla/roja) + minuto del partido, botón "Agregar tarjeta", lista de tarjetas ingresadas
- Botón "Guardar resultado" con modal de confirmación
- Alerta: "Al guardar, la tabla de posiciones se actualizará automáticamente"

**VISTA 25 — Calendario de Partidos**
- Vista tipo calendario mensual
- Cada evento en el calendario: escudos + "vs" + hora
- Filtros: Fase (Grupos, Cuartos, Semifinal, Final), Cancha, Equipo
- Vista alternativa: lista cronológica de partidos con columnas: fecha, hora, local, marcador o "Por jugar", visitante, cancha, fase
- Al hacer clic en un partido: modal con detalle completo

**VISTA 26 — Tabla de Posiciones**
- Tabla completa ordenada por puntos (y diferencia de gol como desempate)
- Columnas: Pos, Escudo, Equipo, PJ, PG, PE, PP, GF, GC, DG, Pts
- Equipos clasificados a eliminatorias resaltados en verde claro (ej. top 4)
- Última actualización: "Actualizada automáticamente — último partido: 12 abr 2025"
- Responsive: en móvil mostrar solo columnas clave

**VISTA 27 — Llaves Eliminatorias (Bracket)**
- Bracket visual de árbol de izquierda a derecha
- Fases: Cuartos de final (4 partidos), Semifinal (2 partidos), Final (1 partido), Campeón
- Cada enfrentamiento: escudos, nombres, marcador (o "Por definir" si no se ha jugado)
- Equipos ganadores resaltados y conectados con líneas hacia la siguiente ronda
- Estado: "Cuartos de final — 2 de 4 partidos jugados"
- Botón "Ver detalle del partido" al hacer hover sobre un enfrentamiento

---

### SECCIÓN 5 — VISTAS DEL ÁRBITRO

**VISTA 28 — Dashboard del Árbitro**
- Sidebar con: Mis Partidos, Alineaciones
- Card "Próximo partido a arbitrar": equipos, fecha, hora, cancha, con mapa o descripción de ubicación
- Lista completa de partidos asignados: tabla con fecha, equipos, cancha, estado (Próximo / En curso / Finalizado)

**VISTA 29 — Detalle de Partido Asignado**
- Header: fecha, hora, cancha con descripción completa de ubicación
- Equipos: cards lado a lado con escudo, nombre y capitán
- Sección "Alineación equipo local": cancha visual con formación (solo lectura)
- Sección "Alineación equipo visitante": cancha visual con formación (solo lectura)
- Botón "Ver perfil completo" de cada jugador al hacer clic en la ficha

---

### SECCIÓN 6 — VISTAS DEL ADMINISTRADOR

**VISTA 30 — Dashboard del Administrador**
- Sidebar con: Inicio, Usuarios, Auditoría, Torneos, Sistema
- Cards de métricas globales: total usuarios registrados, usuarios activos, equipos creados, torneos en el sistema
- Gráfica de registros por semana (últimas 4 semanas)
- Alertas del sistema: ej. "5 usuarios inactivos este mes", "3 intentos de acceso fallidos recientes"
- Accesos rápidos: "Ir a gestión de usuarios", "Ver log de auditoría"

**VISTA 31 — Gestión de Usuarios**
- Tabla paginada con todos los usuarios del sistema
- Columnas: Foto, Nombre, Correo, Rol (badge de color por rol), Estado (Activo/Inactivo), Fecha de registro, Acciones
- Acciones por fila: "Cambiar rol" (abre modal con selector de rol), "Inactivar" / "Reactivar"
- Filtros: por rol, por estado, buscador por nombre o correo
- Modal "Cambiar rol": nombre del usuario, rol actual, selector de nuevo rol, botón "Confirmar cambio"
- Confirmación destructiva para inactivar: "¿Estás seguro de que quieres inactivar a Juan Rodríguez? Esta acción le impedirá acceder al sistema"

**VISTA 32 — Log de Auditoría**
- Tabla con todas las acciones registradas del sistema
- Columnas: Fecha y hora, Usuario, Correo, Acción (badge de tipo: Login, Cambio de rol, Aprobación de pago, Registro de resultado, Logout), Detalle, IP
- Filtros: rango de fechas (datepicker), usuario (buscador), tipo de acción (selector múltiple)
- Botón "Exportar CSV"
- Detalle expandible por fila: información completa del evento auditado
- Estado vacío con filtros activos: "No se encontraron registros con los filtros aplicados"

---

### SECCIÓN 7 — VISTAS COMUNES (cualquier usuario autenticado)

**VISTA 33 — Estadísticas del Torneo**
- Pestañas: Goleadores | Historial de partidos | Resultados por equipo
- Pestaña Goleadores: ranking top 10 con foto, nombre, equipo, goles (barra de progreso visual), número de partidos jugados
- Pestaña Historial de partidos: tabla cronológica con todos los partidos jugados, marcadores, fecha y cancha; filtros por equipo y fase
- Pestaña Resultados por equipo: selector de equipo, luego tarjeta de estadísticas completa: PJ, PG, PE, PP, GF, GC, DG, Pts, goleadores propios, tarjetas recibidas

**VISTA 34 — Información del Torneo (Reglamento y Fechas)**
- Secciones: Bienvenida al torneo con descripción general
- Reglamento completo: formateado con secciones (Participantes, Duración de partidos, Sanciones, etc.)
- Fechas importantes: línea de tiempo vertical con hitos (Inscripciones abiertas, Cierre de inscripciones, Inicio de fase de grupos, Cuartos de final, Final)
- Canchas disponibles: cards con nombre, foto y descripción de ubicación
- Sanciones vigentes: tabla de infracciones y consecuencias

**VISTA 35 — Ver Perfil Público de un Jugador**
- Accesible al buscar jugadores o desde la alineación
- Foto del jugador, nombre completo, posición, dorsal, semestre, equipo actual (con link al equipo)
- Badge de disponibilidad
- Estadísticas en el torneo actual: goles, partidos jugados, tarjetas amarillas, tarjetas rojas
- Botón "Invitar a mi equipo" (visible solo para capitanes, solo si tienen cupo y el jugador está sin equipo)

---

## INSTRUCCIONES ADICIONALES DE DISEÑO

1. **Navegación condicional por rol:** El menú lateral y los accesos visibles deben adaptarse estrictamente al rol del usuario autenticado. Mostrar un ejemplo de menú para cada rol.

2. **Estados de UI:** Para cada vista interactiva, diseña los siguientes estados cuando aplique:
   - Estado vacío (sin datos): ilustración simple + mensaje descriptivo + acción sugerida (ej. "Aún no tienes equipo. ¿Quieres crear uno?")
   - Estado de carga: skeleton screens (no spinners genéricos)
   - Estado de error: mensaje claro con acción de reintento
   - Estado de éxito: toast de confirmación verde

3. **Restricciones de negocio visibles en UI:**
   - El equipo máximo es de 12 jugadores: mostrar siempre el contador "X / 12" y deshabilitar el botón de agregar cuando se llene
   - Solo correos @escuelaing.edu.co o @gmail.com son válidos: mensaje de validación en tiempo real en el formulario de registro
   - Los partidos de árbitro son solo de lectura: no mostrar botones de edición en sus vistas
   - Solo el administrador accede al log de auditoría: no incluir ese ítem en el sidebar de otros roles

4. **Datos de ejemplo sugeridos:**
   - Equipos: "Los Algoritmos FC", "Byte Brothers", "Neural FC", "Los Cibernéticos", "Kernel Panic CF"
   - Jugadores: Sebastián Torres, Valentina Ruiz, Andrés Morales, Camila Herrera, Felipe Jiménez
   - Canchas: "Cancha Principal ECI", "Cancha Auxiliar Bloque B"
   - Torneo activo: "TechCup 2025-1 · 15 marzo – 30 mayo 2025"

5. **Accesibilidad:** Contraste suficiente entre texto y fondo. Labels visibles en todos los campos. Mensajes de error descriptivos.

6. **Idioma:** Todo el contenido en español colombiano. Fechas en formato DD/MM/AAAA. Moneda en COP.

---

## ENTREGABLE ESPERADO

Genera los 35 mockups en el orden indicado. Para cada vista entrega:
- **Nombre y número** de la vista
- **Rol(es)** que la pueden ver
- **Código funcional** (HTML + CSS + JS, o React + Tailwind, o SVG según tu preferencia) con contenido real
- **Componentes clave** presentes en la vista
- **Notas de interacción** importantes (hover states, modales, validaciones)

Usa los **mismos componentes base** (navbar, sidebar, cards, badges, tablas) en todas las vistas para garantizar coherencia visual de sistema de diseño. El resultado debe sentirse como una sola plataforma cohesionada, no como pantallas aisladas.