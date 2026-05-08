# AGENTS.md

## 🚨 Knowledge Base (LEER PRIMERO)
Para entender las reglas de negocio y la estructura técnica, consulta:
- **Reglas de Negocio:** `docs/PRD.md`
- **Arquitectura Frontend:** `docs/architecture/frontend.md`
## Project Overview

This repository contains the **frontend application** for the TECHUP Football Tournament Management Platform.

The platform allows participants, captains, organizers, referees and administrators to interact with the football tournament ecosystem.

The frontend communicates with a backend API and provides user interfaces for:

* authentication
* player profiles
* team management
* tournament management
* match information
* administrative controls

---

# Technology Stack

Frontend stack:

* React
* TypeScript
* TailwindCSS
* React Router
* React Query (for server state)
* Zod (for data validation)

Guidelines:

* Use **functional components**
* Use **TypeScript strictly**
* Avoid `any`
* Prefer composition over inheritance

---

# Architecture

The frontend follows **Screaming Architecture (feature-based architecture)**.

Code must be organized **by feature**, not by technical layers.

Example:

src/
features/
auth/
pages/
components/
hooks/
services/
types/
teams/
pages/
components/
hooks/
services/
types/
tournaments/
pages/
components/
hooks/
services/
types/

Shared resources go in:

src/shared/

Example:

src/shared/
components/
hooks/
utils/
types/
constants/

Routing configuration lives in:

src/app/router

---

# Feature Structure

Each feature must follow this structure:

feature-name/
components/
pages/
hooks/
services/
types/

Descriptions:

components → UI elements specific to the feature
pages → route-level components
hooks → custom hooks for logic
services → API communication
types → TypeScript interfaces and DTOs

---

# Styling Rules

* TailwindCSS must be used for styling.
* Avoid inline styles.
* Extract reusable UI components when duplication appears.

Shared UI components must go to:

src/shared/components

Examples:

Button
Modal
Input
Card

Colors to use:
This colors already exists in indes.css
--color-oxblood: #990000;
--color-cool-sky: #48acf0;
--color-white-pure: #ffffff;
--color-ink: #101828;
--color-mist: #eef2ff;
--color-sand: #fff7ed;


---

# State Management

Use the following rules:

Server state:

* React Query

Local UI state:

* React hooks

Use zustand for global state only if its neccesary.

---

# API Communication

All HTTP requests must be implemented inside **services**.

Example:

features/auth/services/authService.ts

Components must never directly call axios.

Use tansktack query for http request with axios

---

# Routing

Routing must be handled with **React Router**.

Routes must be declared in:

src/app/router

Example:

/login
/register
/home
/teams
/tournament

Each route must map to a page component.

---

# Naming Conventions

Components → PascalCase
Hooks → useSomething
Files → camelCase or kebab-case

Examples:

LoginPage.tsx
useAuth.ts
teamService.ts

---

# Role-based UI

The system has multiple roles:

* Participant
* Captain
* Organizer
* Referee
* Administrator

UI components must conditionally render features depending on the role.

Example:

captains can create teams
organizers can manage tournaments
referees can view assigned matches

Role information comes from the authenticated user profile.

---

# What the Agent Should Do

When generating code the agent must:

1. Identify the feature
2. Create or modify files inside that feature
3. Respect the architecture
4. Avoid placing feature code in shared folders
5. Reuse existing shared components when possible

---

# What the Agent Must Avoid

Do not:

* create large monolithic components
* duplicate shared components
* mix API logic with UI components
* break the feature-based architecture

Always follow the existing folder structure.
