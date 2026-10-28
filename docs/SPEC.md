# Haretna (حارتنا) — Feature Parity & Hardening Spec

## Problem Statement

The Haretna codebase had accumulated technical debt and inconsistencies across its web (React/Vite + NestJS/Prisma) and mobile (Flutter) clients. The backend used Supabase schema as a parallel source of truth, posts could be either OFFER or REQUEST (violating the demand-driven model), swap statuses were untyped strings, auth fabricated fake emails, CORS was wide open, frontend had hardcoded mock data, and the mobile app lacked feature parity with the web. A comprehensive grill (Q1–Q10) identified 10 decisions that needed implementation, followed by code review fixes and UI/UX hardening.

## Solution

Implement all 10 grill decisions across backend, web frontend, and mobile. Establish Prisma+NestJS as the single source of truth. Enforce demand-driven posts (all REQUEST). Introduce a SwapStatus enum with a transition FSM. Make auth phone-first with nullable email. Guard post reads and strip PII. Restrict CORS. Replace frontend mocks with real API calls. Sync mobile to web. Add CI. Fix code review findings (CORS production, fake emails, transition gaps, passwordHash in JWT, etc.). Add logo branding. Implement RBAC. Improve responsiveness.

## User Stories

1. As a user, I want to register with only my phone number, so that I don't need to provide an email.
2. As a user, I want all posts to be REQUEST type, so that the platform stays demand-driven.
3. As a user, I want swap status to follow a strict lifecycle (PENDING→ACCEPTED→ACTIVE→COMPLETED/CANCELLED), so that state transitions are predictable.
4. As a user, I want my phone number and exact location to be hidden from unauthenticated users, so that my privacy is protected.
5. As a user, I want only authenticated users to browse posts, so that the platform is secure.
6. As an admin, I want CORS to be restricted to known origins, so that unauthorized sites can't access the API.
7. As a user, I want the web app to show real data instead of mocks, so that I see accurate information.
8. As a mobile user, I want to log in with Super Admin credentials for testing, so that I can access admin features.
9. As a user, I want the Exchanges page to be responsive on mobile web, so that I can use it on any device.
10. As a user, I want completed items to be hidden from active feeds, so that I only see actionable items.
11. As a user, I want to see a history of completed exchanges, so that I can rate and review past transactions.
12. As an admin, I want only Super Admins to change user roles, so that permissions are properly controlled.
13. As a user, I want the app logo to appear consistently across the UI, so that the brand is recognizable.

## Implementation Decisions

### Backend (NestJS + Prisma)
- **Schema**: Added `SwapStatus` enum (PENDING, ACCEPTED, ACTIVE, COMPLETED, CANCELLED). Changed `Post.type` default to `REQUEST`. Made `User.email` nullable (`String?`).
- **Auth**: Phone-first registration/login. Removed fake `phone@haretna.com` email fabrication. JWT payload contains `{sub, phone}` only. No email required.
- **Posts**: `create()` forces `PostType.REQUEST`. `findAll`/`findOne` use `select` to strip `phone` and exact `lat`/`lng` from user/post responses. Guarded with `JwtAuthGuard`.
- **Swaps**: `ALLOWED_TRANSITIONS` map enforces FSM. `updateStatus` validates transitions → `BadRequestException` on illegal. `ACCEPTED→CANCELLED` allowed.
- **CORS**: `CORS_ORIGINS` env var. Default localhost:5173/5174 only when `NODE_ENV !== 'production'`. In production, only explicitly allowed origins.
- **Migration**: Full initial migration `20261027065603_init` with CREATE TABLE + ALTER TABLE.
- **Seed**: Uses `SwapStatus` enum. No fake emails.
- **SupabaseStorageService**: Gracefully handles missing credentials (logs warning, falls back to local storage).

### Frontend (React/Vite)
- **Auth**: Phone-first login/register. Removed hardcoded default user ('ياسين جمال'). Profile charts show empty "coming soon" states.
- **Posts**: All posts sent as `REQUEST`. Removed `OFFER` type from frontend.
- **Swaps**: Status comparisons use `PENDING`/`ACCEPTED`/`ACTIVE`/`COMPLETED`/`CANCELLED`. Real ratings fetched from `/api/ratings`.
- **Admin**: RBAC with 3 roles (super_admin, committee, user). Only Super Admins see promote button. Route guards for admin pages.
- **Initiatives**: Moved `CommunityInitiativesSection` from Home to Exchanges page.
- **Status filtering**: Completed items hidden from active feeds. Added "History/Completed" section in Exchanges.
- **Responsiveness**: Fixed Exchanges page tabs (flex-wrap), added overflow-x-hidden, min-w-0, max-w-full. Fixed map card with max-w-[90vw], flex-wrap.
- **Logo**: Added `haretna_logo.png` to public dir. Used in TopAppBar, LoginModal, AdminDashboard, favicon.
- **Code review fixes**: Removed PRESET_ACCOUNTS (fake users), removed hardcoded "ياسين جمال", stripped passwordHash from JWT, fixed inconsistent swap filters, simplified backendType, extracted magic number constant, fixed message chain.

### Mobile (Flutter)
- **Auth**: Super Admin mock login with credentials bassam20047jamm@gmail.com / 0962752582 / password123.
- **RBAC**: User entity with isSuperAdmin, isCommittee, isAdmin, isUser getters.
- **Feed logic**: New posts not prepended to Home feed.
- **Map popup**: Fixed responsiveness (56x56 image, maxLines: 2, crossAxisAlignment.start).
- **Login UI**: Accepts email or phone input. Super Admin quick-login card added.

### CI/CD
- GitHub Actions workflow: PostgreSQL service, backend build, migration deploy, seed, start backend, smoke tests.
- Smoke tests: login, GET /posts auth check, create post (OFFER→REQUEST).
- `npm test` script added to root and backend.

### Documentation
- `docs/ERD.md`: Email optional, PostType REQUEST, SwapStatus enum.
- `docs/REQUIREMENTS.md`: FR-1.1 phone-first.
- `REVIEW_CHECKLIST.md`: Step-by-step verification checklist.

## User Stories

1. As a user, I want to register with only my phone number, so that I don't need to provide an email.
2. As a user, I want all posts to be REQUEST type, so that the platform stays demand-driven.
3. As a user, I want swap status to follow a strict lifecycle, so that state transitions are predictable.
4. As a user, I want my phone and exact location hidden from unauthenticated users, so that my privacy is protected.
5. As a user, I want only authenticated users to browse posts, so that the platform is secure.
6. As an admin, I want CORS restricted to known origins, so that unauthorized sites can't access the API.
7. As a user, I want the web app to show real data instead of mocks, so that I see accurate information.
8. As a mobile user, I want to log in with Super Admin credentials for testing.
9. As a user, I want the Exchanges page to be responsive on mobile web.
10. As a user, I want completed items hidden from active feeds, so that I only see actionable items.
11. As a user, I want to see a history of completed exchanges, so that I can rate past transactions.
12. As an admin, I want only Super Admins to change user roles.
13. As a user, I want the app logo to appear consistently across the UI.

## Implementation Decisions

- **Prisma+NestJS as source of truth**: Deleted `supabase/schema.sql`. All schema changes go through Prisma Migrate.
- **SwapStatus enum**: PENDING, ACCEPTED, ACTIVE, COMPLETED, CANCELLED. Transition map enforced in `updateStatus()`.
- **Phone-first auth**: `email` nullable. JWT payload `{sub, phone}`. No fake `phone@haretna.com`.
- **CORS**: `CORS_ORIGINS` env var. Default localhost only in non-production. Production requires explicit origins.
- **Frontend mocks removed**: LoginModal PRESET_ACCOUNTS deleted. MySwapsView hardcoded user replaced with currentUser data.
- **RBAC**: 3 roles (super_admin, committee, user). Only super_admin sees promote button.
- **Status filtering**: `swapItems` filtered to exclude COMPLETED/CANCELLED from active feed. History section shows completed items.
- **Logo**: `haretna_logo.png` in `frontend/public/`. Used in TopAppBar, LoginModal, AdminDashboard, favicon.

## Testing Decisions

- Backend smoke tests in CI: login, GET /posts auth check, create post (OFFER→REQUEST).
- TypeScript compilation checks (`tsc --noEmit`) for both frontend and backend.
- Manual browser verification for UI flows.
- Flutter CLI not available on this machine for `flutter analyze`/`flutter test`.

## Out of Scope

- Mobile initiatives feature (not present in mobile app).
- Mobile admin dashboard (web-only).
- Email-based auth recovery (email is nullable, not implemented).
- Real Supabase storage in CI (gracefully degraded to local fallback).

## Further Notes

- All changes are on the `main` branch of `https://github.com/bassam-j3/hertna.git`.
- Web Phase 1 (Steps 1-6) is complete and verified.
- Mobile Phase 2 (Steps 7-9) is partially implemented; needs manual verification.
- CI workflow needs SUPABASE env vars (handled gracefully by fallback).
- Flutter CLI not installed on this machine.