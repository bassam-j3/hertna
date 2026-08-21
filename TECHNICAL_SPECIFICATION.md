# System & Technical Requirements Specification
## Haretna (حارتنا) - A Demand-Driven Community Takaful Platform

---

## 1. Executive Summary & Architecture

### 1.1 Project Overview (The Demand-Driven Paradigm)
**Haretna** is a localized, geo-aware web application designed to foster community support and mutual aid (Takaful). Diverging from traditional marketplace models where users post what they *have*, Haretna introduces a **Demand-Driven Core Logic**. 

In this system, residents act primarily as "Requesters", posting exactly what they *need* (e.g., tools, emergency assistance, food). The ecosystem is fueled by neighbors who view these localized requests and fulfill them by offering to lend the items or provide the service. This model dramatically reduces friction and focuses community resources on immediate, verifiable needs.

### 1.2 Full-Stack Architecture
The application relies on a modern, deeply uncoupled Client-Server architecture:
*   **Frontend (Client Layer):** Built with **React 18** and **Vite** for aggressive hot-module replacement and optimized production bundling. It acts as a Single Page Application (SPA).
*   **Backend (API Layer):** Powered by **NestJS** (Node.js), providing a highly modular, TypeScript-first backend adhering strictly to SOLID principles and Dependency Injection (DI).
*   **Database (Persistence Layer):** Uses a robust **PostgreSQL 15** relational database. Database schema and migrations are managed programmatically via the **Prisma ORM**.
*   **DevOps & Infrastructure:** Fully containerized using **Docker** and orchestrated via **Docker Compose**. The production frontend is served lightning-fast via an **NGINX** reverse proxy.

---

## 2. Functional Requirements

### 2.1 Authentication & Authorization Flow
*   **JWT Generation:** Upon successful authentication, the NestJS backend issues a cryptographically signed JSON Web Token (JWT) utilizing `@nestjs/jwt` and `passport-jwt` strategies.
*   **Client-Side Persistence:** The JWT is securely stored on the client side and injected into the Authorization header (`Bearer <token>`) of every outbound request via **Axios Interceptors**.
*   **Route Protection:** Backend routes are fortified using NestJS AuthGuards. If a token expires or is manipulated, the backend rejects the request (401 Unauthorized), and the Axios interceptor forces a client-side logout to clear the session state.

### 2.2 Interactive Geolocation & Mapping
*   **Spatial Rendering:** Integrates `react-leaflet` with OpenStreetMap tiles to plot active community requests in a geographical context.
*   **HTML5 Geolocation API:** On mount, the Map View aggressively requests the user's real-time GPS coordinates via `navigator.geolocation.getCurrentPosition()`. 
*   **Graceful Fallbacks:** If the user denies GPS permissions or the API times out, the system implements a graceful fallback algorithm, defaulting to a predefined city center (e.g., Damascus) to ensure uninterrupted UI flow.
*   **Dynamic Markers:** Map pins are injected via Leaflet's `divIcon`, parsing raw HTML strings to render fully customized, Tailwind-styled UI elements based on the post category (e.g., bouncing indicators for `URGENT` requests).

### 2.3 The Demand-Driven Swaps Engine
*   **Post Creation:** Authenticated users dispatch payloads containing their requested item, categorical tags, and urgency flags. The system strictly enforces these as `PostType.REQUEST`.
*   **Fulfillment Protocol (Swaps):** When a neighbor clicks "I have this" (أنا أمتلك هذا), the system creates a transactional `SwapItem`. 
*   **Relational Mapping:** The engine dynamically infers relationships: the creator of the original Post is assigned the `borrowerId` foreign key, while the authenticated user fulfilling the request is assigned the `lenderId` foreign key.
*   **Lifecycle Management:** The swap then enters a finite state machine (`PENDING` → `ACTIVE` → `COMPLETED`), allowing both parties to message, coordinate, and leave Trust Point ratings.

---

## 3. Non-Functional Requirements & Infrastructure

### 3.1 Security & Networking
*   **Dynamic CORS Policy:** The `main.ts` bootstrap configures a regex-validated CORS policy that seamlessly accepts standard Vite development ports (e.g., 5173, 5174) across local network IPs, while blocking unknown origins in production.
*   **Global Exception Filtering:** A custom NestJS `AllExceptionsFilter` intercepts the entire application lifecycle. It traps untracked 500 Internal Server Errors and 404 Route Not Found errors, stripping stack traces and returning sanitized, standard JSON responses to prevent information leakage.
*   **Password Hashing:** User credentials are cryptographically salted and hashed via `bcrypt` prior to database insertion.

### 3.2 UI/UX, Styling & Accessibility
*   **Atomic CSS:** The UI is crafted exclusively using **Tailwind CSS**. It relies on custom CSS variables (e.g., `--color-surface-container`) injected into the `@theme` directive, ensuring strict adherence to a specific design system.
*   **Mobile-First Responsiveness:** The viewport is tightly controlled. Properties like `overflow-x-hidden` on the root body element eradicate horizontal scrolling anomalies on mobile. Z-index stacking contexts are meticulously managed between the floating Bottom Navigation Bar, Leaflet Maps, and Modals.
*   **RTL Optimization:** The entire DOM is strictly typed with `dir="rtl"`, ensuring native Arabic language flow. Padding, margins, and absolute positioning utilize Tailwind's logical properties (`start`, `end`) where applicable.

### 3.3 DevOps, Containerization & CI/CD
*   **Multi-Stage Docker Builds:** 
    *   **Backend:** Utilizes an `alpine` Node image. Stage 1 installs dependencies and generates the Prisma client. Stage 2 copies only the transpiled `/dist` and `/node_modules`, drastically reducing image footprint.
    *   **Frontend:** Stage 1 builds the Vite/React static assets. Stage 2 serves them via an **NGINX** alpine image.
*   **NGINX SPA Routing:** A custom `nginx.conf` file includes `try_files $uri $uri/ /index.html;` to ensure React Router handles client-side routing correctly without throwing 404 errors on deep links.
*   **Docker Compose:** Orchestrates the multi-container environment, managing internal Docker networks, volumes (`pgdata` for database persistence), and dependency trees (`depends_on: db`).
*   **CI/CD Pipeline (Prepared):** Structured for GitHub Actions to run ESLint, execute Jest unit tests, and trigger automated Docker image builds upon merges to the `main` branch.

---

## 4. "The Resume Extract" (For Portfolio & Job Interviews)

*   **Architected and deployed** a full-stack, demand-driven web application using React, NestJS, and PostgreSQL, implementing a complex state machine for peer-to-peer item swapping and community aid.
*   **Engineered** a secure, JWT-based authentication flow with Axios interceptors and custom NestJS AuthGuards, fortified by a Global Exception Filter to sanitize stack traces and handle API anomalies.
*   **Developed** a geo-aware interactive mapping system integrating React-Leaflet and the HTML5 Geolocation API, featuring dynamic custom HTML markers and graceful fallbacks for degraded network permissions.
*   **Designed** a highly responsive, mobile-first, RTL (Right-To-Left) interface using Tailwind CSS, implementing glassmorphism aesthetics and complex z-index management for overlapping maps and navigation components.
*   **Containerized** the entire infrastructure using Docker Compose, writing optimized multi-stage Dockerfiles and configuring an NGINX reverse-proxy to handle Single Page Application (SPA) routing fallbacks.
