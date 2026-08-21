# Functional Requirements Specification
## Chapter: System Functional Logic & Module Specifications
**Project Name:** Haretna (حارتنا) - A Demand-Driven Community Takaful Platform

---

### 1. User Authentication & Authorization Module

The Authentication Module serves as the strict gatekeeper for the Haretna platform. All actions requiring data mutation (creating posts, fulfilling swaps) mandate a valid authenticated state.

#### 1.1 Login & Registration Flow
*   **Registration Logic:** To register, a user must submit a unique email, plaintext password, full name, active phone number, and location metadata (City, Neighborhood, and coordinate constraints: Latitude/Longitude). The backend validates this payload structurally before processing.
*   **Login Verification:** During login, the user submits their email and password. The system queries the `User` table to match the email. It then cryptographically verifies the submitted password against the stored hash. Upon successful verification, the system issues a short-lived access payload.

#### 1.2 JWT (JSON Web Token) Management
*   **Token Generation:** The backend generates a signed JWT payload containing the user's `id` (UUID) and `email`. The token is signed using a highly secure, server-side secret key.
*   **Client Storage:** Upon receipt, the frontend explicitly stores the JWT string inside HTML5 `localStorage` (under the key `'token'`) alongside a localized `user` session object.
*   **Interceptor Injection:** The system utilizes an Axios request interceptor (`api.interceptors.request.use`). This logic intercepts every outbound HTTP request to the API, retrieves the JWT from `localStorage`, and injects it into the `Authorization: Bearer <token>` header.
*   **Expiration & Rejection:** If the backend decodes an expired or invalid JWT, it returns an HTTP 401 response. An Axios response interceptor catches this 401, purges the `localStorage`, and functionally logs the user out, forcing them back to the Authentication modal.

#### 1.3 Role & User Type Constraints
The system classifies users contextually to organize community operations. The primary functional constraints are:
*   **Resident (مقيم):** The standard user who can post requests and fulfill local swaps.
*   **Returning (عائد):** Identifies users who have recently returned to the neighborhood, prioritizing their urgent requests in the feed.
*   **Donor (متبرع):** Users explicitly offering items as direct gifts rather than temporary loans.
*   **Committee (لجنة الحي):** Users holding administrative privileges to organize large-scale "Community Initiatives" (e.g., neighborhood cleanups).

---

### 2. Demand-Driven Takaful (Needs) Module

Unlike traditional marketplaces focusing on supply, Haretna's core engine is built purely around local demand (Needs).

#### 2.1 Post Creation Logic
*   **Payload Construction:** When a user initiates a request, the system constructs a `Post` entity. Crucially, the system functionally enforces the `type` attribute of this entity to be strictly `REQUEST`.
*   **Data Structure:** A `Post` requires a `title`, `description`, `location` (City, Neighborhood), and spatial coordinates (`lat`, `lng`). It is permanently bound to the `userId` of the creator.
*   **Urgency Flagging:** Users can functionally toggle a boolean `urgent` property. When true, the system escalates the post's visibility and triggers distinctive UI markers (e.g., orange warning indicators).

#### 2.2 Categorical Classification
The system parses requests into strict functional categories to facilitate filtering:
*   **أدوات منزلية (Tools/Household):** Requests for physical objects intended for temporary borrowing (loans).
*   **طعام (Food):** Requests for consumable aid, functionally treated as one-way gifts.
*   **طلبات عاجلة (Urgent Requests):** High-priority needs bypassing standard chronological sorting.

#### 2.3 The Fulfillment Interaction Flow (Swapping)
The fulfillment engine bridges the gap between a Requester (Demand) and a Provider (Supply).
1.  **Trigger:** A viewing neighbor clicks the specific interaction button: "أنا أمتلك هذا" (I have this).
2.  **Relational Mapping:** The system executes an API call `PATCH /api/swaps/request/:postId`.
3.  **Data Generation:** The backend generates a `SwapItem` transaction record.
4.  **Role Assignment:** The system performs a highly specific relational mapping:
    *   `borrowerId`: Assigned to the `userId` of the original Post creator.
    *   `lenderId`: Assigned to the `userId` of the currently authenticated user (the one who clicked the button).
    *   `postId`: Linked to the original post to maintain referential integrity.

---

### 3. Interactive Neighborhood Map Module

The spatial module allows users to visualize local demand geographically.

#### 3.1 Fetching and Rendering Logic
*   **Spatial Plotting:** The map component iterates over the active `Post` array. For every post containing valid `lat` and `lng` floats, the system dynamically plots a Marker layer precisely at those coordinates.
*   **Category-Based Logic:** The system evaluates the post's `category` and `urgent` boolean. Based on these logical branches, it injects specific HTML strings (e.g., a 'handyman' icon for tools, or a pulsing animation for urgent items) into the Leaflet rendering engine.

#### 3.2 Distance Calculation & Geolocation API
*   **User Location Acquisition:** Upon mounting, the component invokes the browser's `navigator.geolocation.getCurrentPosition()` method to capture the user's live physical coordinates.
*   **Fallback Logic:** If the user denies location permissions, or the API fails (timeout), the system executes a predefined callback routing the map's center to a fallback static coordinate (e.g., Damascus: 33.5138, 36.2765).
*   **Distance Approximation:** The system calculates the proximity of each post relative to the user's active coordinates, rendering a string (e.g., "500 m") to indicate spatial relevance.

#### 3.3 Interactive Selection Flow
*   **Marker Click Event:** When a user clicks a map marker, the system fires a `handleMarkerClick(post)` event, overriding the `selectedItem` state.
*   **Focus Shifting:** This action functionally triggers the rendering of a detailed, localized "Item Card" at the bottom of the viewport, exposing the precise description, distance, and the critical Fulfillment interaction button for that specific coordinate.

---

### 4. Swaps & Profile Management Module

This module tracks the ongoing transactional lifecycles between neighbors.

#### 4.1 "My Requests" vs "Neighbors I'm Helping" Filtering
*   **Data Aggregation:** The system queries the `SwapItem` table where the authenticated user is either the `borrowerId` OR the `lenderId`.
*   **Client-Side Segregation:**
    *   **My Requests (طلباتي):** The system filters the array to strictly include items where `swap.borrowerId === currentUser.id`. This array represents items the user is waiting to receive or currently borrowing.
    *   **My Lends (إعاراتي / مساعدة الجيران):** The system filters the array to strictly include items where `swap.lenderId === currentUser.id`. This array represents the items the user has volunteered to provide.

#### 4.2 Lifecycle State Machine
A `SwapItem` moves through strict logical states:
*   **PENDING:** The initial state when a neighbor offers help. Both users coordinate via the `actionType: MESSAGE` constraint.
*   **ACTIVE (قيد الإعارة):** The physical item has exchanged hands. The system displays this status with a blue visual indicator.
*   **COMPLETED (مكتمل):** The item has been returned (or the food consumed). The system triggers a status update (`PATCH /api/swaps/:id/status`), shifting the status string to `completed`. This unlocks the Rating Engine, allowing the `borrowerId` to increase the `trustPoints` of the `lenderId`.
