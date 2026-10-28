# Haretna (حارتنا) — Domain Context

## Domain Glossary

### Post
A community request (طلب) created by a user. All posts are strictly `REQUEST` type (demand-driven model). Posts have categories (tools, food, urgent needs, etc.) and an urgency flag.

### Swap / Exchange (مبادلة)
A transaction between two users: a borrower (post owner) and a lender (helper). Tracks item lending/borrowing lifecycle.

### SwapStatus
The lifecycle states of a swap: `PENDING` → `ACCEPTED` → `ACTIVE` → `COMPLETED` / `CANCELLED`. Enforced via FSM transition map in `SwapsService`.

### User Roles
- **super_admin** (مدير النظام): Full system access, can change user roles
- **committee** (عضو لجنة / مشرف حي): Neighborhood supervisor, can moderate content
- **user** (مستخدم عادي): Regular user, can create posts and participate in swaps

### Community Initiative (مبادرة مجتمعية)
A community-led campaign (e.g., neighborhood cleanup). Has participants, categories, and status (upcoming/active/completed).

### Initiative Status
Initiative statuses use lowercase strings: `'upcoming'`, `'active'`, `'completed'`. This intentionally differs from `SwapStatus` which uses uppercase enum values (`PENDING`, `ACCEPTED`, etc.). The casing difference reflects different domain concepts — swaps are backend-enforced FSM states, while initiative statuses are frontend display states.

### Post Type
All posts are `REQUEST` (demand-driven). The `OFFER` enum value is kept in the database for future use but is never created by users.

## Key Decisions

### Phone-First Authentication
Users register and login with phone number + password. Email is optional (nullable) for future recovery/notifications. No fake `phone@haretna.com` emails are created.

### Privacy by Default
- `GET /posts` and `GET /posts/:id` require JWT authentication
- Post responses strip `phone` and exact `lat`/`lng` from user/post objects
- Only authenticated users can browse posts

### CORS Policy
- Development: localhost:5173, localhost:5174 allowed
- Production: Only origins listed in `CORS_ORIGINS` env var
- `CORS_ORIGINS` must be set in production (throws error if unset)

### Demand-Driven Model
- All user-generated posts are `REQUEST` type
- Backend `create()` forces `PostType.REQUEST` regardless of input
- Frontend sends `type: 'REQUEST'` for all post creation

### Swap Lifecycle
- FSM enforced: `PENDING → ACCEPTED → ACTIVE → COMPLETED/CANCELLED`
- `ACCEPTED → CANCELLED` is allowed (user can cancel after acceptance)
- Illegal transitions rejected with 400 Bad Request

### Storage Strategy
- Primary: Supabase Storage (if credentials configured)
- Fallback: Local file storage (automatic on Supabase failure)
- CI: Uses local fallback (no Supabase credentials)
