# Frontend Architecture: TECHCUP FÚTBOL

## 1. Overview
Este documento detalla la arquitectura técnica del frontend. El objetivo principal es mantener una separación clara de responsabilidades y asegurar que el código sea escalable y fácil de mantener por agentes de IA y desarrolladores.

## 2. Tech Stack
* **Core:** React + TypeScript (Strict Mode).
* **Styling:** TailwindCSS (Utility-first).
* **Routing:** React Router (Definido en `src/app/router`).
* **State Management:**
    * *Server State:* React Query (TanStack Query) para caché y fetching.
    * *UI State:* React Hooks (`useState`, `useContext`).
    * *Global State:* Zustand (solo si es estrictamente necesario).
* **Validation:** Zod para esquemas de datos y formularios.

## 3. Screaming Architecture (Feature-Based)
El proyecto se organiza por **funcionalidades de dominio**, no por tipos de archivos técnicos.

### Estructura de una Feature (`src/features/`)
Cada módulo en `features/` debe ser autónomo y contener:
* `pages/`: Componentes que actúan como rutas (ej. `TeamDashboardPage.tsx`).
* `components/`: UI específica de la funcionalidad (ej. `TeamCard.tsx`).
* `hooks/`: Lógica de React y consumo de servicios (ej. `useTeams.ts`).
* `services/`: Llamadas directas a la API (ej. `teamService.ts`).
* `types/`: Interfaces de TypeScript y DTOs específicos.

## 4. Shared Module (`src/shared/`)
Contiene elementos reutilizables en múltiples features:
* `components/`: Botones, Modales, Inputs, Layouts base.
* `hooks/`: Hooks genéricos (ej. `useDebounce`).
* `utils/`: Formateadores de fecha, validadores, cliente de API (Axios config).
* `types/`: Interfaces globales (ej. `User`, `ApiResponse`).

## 5. Reglas de Comunicación (API)
1.  **Prohibido:** Los componentes no pueden usar `fetch` o `axios` directamente.
2.  **Flujo:** Componente ➔ Hook ➔ Service ➔ API.
3.  **Servicios:** Deben retornar promesas tipadas.
    ```typescript
    // Ejemplo en features/teams/services/teamService.ts
    export const fetchTeams = async (): Promise<Team[]> => {
      const { data } = await apiClient.get('/teams');
      return data;
    };
    ```

## 6. UI Basada en Roles
El sistema debe renderizar componentes condicionalmente basándose en el rol del usuario (extraído del JWT):
* **Capitán:** Acceso a gestión de equipo.
* **Organizador:** Acceso a configuración de torneos.
* **Árbitro:** Acceso a reporte de partidos.

## 7. Convenciones de Código
* **Componentes:** PascalCase (ej. `TournamentList.tsx`).
* **Hooks:** camelCase con prefijo "use" (ej. `useMatchEvents.ts`).
* **Servicios/Utils:** camelCase (ej. `authService.ts`).
* **Estilos:** Solo Tailwind. Evitar CSS puro o estilos en línea.