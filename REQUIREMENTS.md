# 📋 Haretna (حارتنا) - Requirements Document

This document outlines the formal Functional and Non-Functional Requirements for the "Haretna" (حارتنا) Capstone Project based on the implemented Demand-Driven system architecture.

---

## 🎯 1. Functional Requirements (FR)

Functional requirements define the specific behaviors, features, and functions of the system.

### 1.1 User Authentication & Authorization (FR-1)
* **FR-1.1:** The system MUST allow users to register an account using an email, password, name, phone number, and location coordinates.
* **FR-1.2:** The system MUST allow users to log in and receive a secure JWT (JSON Web Token).
* **FR-1.3:** The system MUST maintain user sessions via `localStorage` and intercept API requests to inject the JWT.
* **FR-1.4:** The system MUST allow users to log out, which securely clears all local session data.

### 1.2 Demand-Driven Post Management (FR-2)
* **FR-2.1:** The system MUST allow authenticated users to create a "Need" (Request) specifying the item they need to borrow, a description, category, and urgency level.
* **FR-2.2:** The system MUST automatically classify all user-generated posts as `REQUEST` (Demand-Driven model).
* **FR-2.3:** The system MUST display a Home Feed populated exclusively with neighbor requests, sorted chronologically or by urgency.
* **FR-2.4:** The system MUST allow users to filter requests by category (e.g., Tools, Food, Urgent Needs).

### 1.3 Swaps (Borrowing & Lending) Engine (FR-3)
* **FR-3.1:** The system MUST allow a viewing user to offer help by clicking "I have this" (أنا أمتلك هذا) on a neighbor's request.
* **FR-3.2:** The system MUST automatically generate a `Swap` record where the post owner is designated as the `borrower` and the responding user is the `lender`.
* **FR-3.3:** The system MUST track the status of a swap through a predefined lifecycle: `PENDING` -> `ACCEPTED` -> `ACTIVE` -> `COMPLETED` / `CANCELLED`.
* **FR-3.4:** The system MUST provide a "My Swaps" dashboard where a user can separately track items they are lending ("My Lends") and items they are borrowing ("My Requests").

### 1.4 Geolocation & Mapping (FR-4)
* **FR-4.1:** The system MUST integrate an interactive map (using Leaflet/OpenStreetMap) to display neighbor requests spatially.
* **FR-4.2:** The system MUST attempt to read the user's HTML5 Geolocation (`navigator.geolocation`) upon opening the map.
* **FR-4.3:** The system MUST gracefully fall back to a default location (e.g., Damascus coordinates) if geolocation is denied or unavailable.
* **FR-4.4:** The system MUST display different visual markers on the map based on the request category (e.g., bouncing orange drops for Urgent Water, green tools for hardware).

### 1.5 Community Initiatives (FR-5)
* **FR-5.1:** The system MUST allow users to view community-led initiatives (e.g., neighborhood cleanups).
* **FR-5.2:** The system MUST allow users to RSVP or join an initiative, updating the participant count in real-time.

---

## 🛡️ 2. Non-Functional Requirements (NFR)

Non-functional requirements specify the criteria that can be used to judge the operation of the system, rather than specific behaviors.

### 2.1 Performance & Scalability (NFR-1)
* **NFR-1.1:** The frontend single-page application (SPA) MUST achieve a Time-to-Interactive (TTI) of under 3 seconds on standard 4G networks.
* **NFR-1.2:** The backend API MUST respond to 95% of standard read requests in under 200 milliseconds.
* **NFR-1.3:** The system MUST be fully containerized via Docker to allow horizontal scaling of the Node.js/NestJS application instances.

### 2.2 Security & Privacy (NFR-2)
* **NFR-2.1:** User passwords MUST be securely hashed using bcrypt before being stored in the PostgreSQL database.
* **NFR-2.2:** API endpoints requiring authorization MUST be protected using Passport JWT strategies.
* **NFR-2.3:** The backend MUST configure dynamic CORS to restrict origin access appropriately while allowing seamless Vite development.
* **NFR-2.4:** The database MUST NOT expose user phone numbers or exact latitude/longitude to unauthenticated endpoints.

### 2.3 Reliability & Availability (NFR-3)
* **NFR-3.1:** The backend MUST implement a Global Exception Filter to ensure that all unhandled exceptions (500s) and routing errors (404s) are caught and returned as clean, standard JSON formats rather than HTML crash pages.
* **NFR-3.2:** The system architecture MUST rely on a PostgreSQL relational database with Prisma ORM to guarantee ACID compliance for swap transactions.
* **NFR-3.3:** `docker-compose.yml` MUST use `restart: always` policies to automatically recover the API and Database in the event of a crash.

### 2.4 Usability & Accessibility (NFR-4)
* **NFR-4.1:** The User Interface MUST follow a strict Right-To-Left (RTL) layout to natively support the Arabic language.
* **NFR-4.2:** The interface MUST be fully responsive, avoiding horizontal scrolling issues on mobile devices (enforced via `overflow-x-hidden`).
* **NFR-4.3:** The application MUST utilize a visually rich, modern design system heavily featuring micro-animations, glassmorphism, and intuitive navigation (BottomNav on mobile).

### 2.5 Maintainability & DevOps (NFR-5)
* **NFR-5.1:** The codebase MUST be strictly typed using TypeScript on both the Frontend (React) and Backend (NestJS).
* **NFR-5.2:** Database schema changes MUST be tracked and migrated using Prisma Migrate.
* **NFR-5.3:** The deployment configuration MUST include an NGINX reverse-proxy stage in the frontend Dockerfile to correctly handle React Router SPA fallbacks.
