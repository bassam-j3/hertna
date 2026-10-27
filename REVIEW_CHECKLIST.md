# Haretna Review Checklist

**Workflow:** Web first → Mobile second. No mobile feature is considered done until the equivalent web endpoint is verified.
**Backend:** Single source of truth — both clients consume the same `SwapStatus` enum and phone-first auth.

---

## Phase 1: Web App (Backend + Frontend)

### Step 1: Backend — Auth & Phone-First (Q4)
- [ ] 1.1 Register with phone only: `POST /api/auth/register` with `{phone, password, name, city, neighborhood}` → returns `token` + `user` (no email)
- [ ] 1.2 Login with phone: `POST /api/auth/login` with `{phone, password}` → returns `token`
- [ ] 1.3 JWT payload contains `phone`, not fake `phone@haretna.com` email

### Step 2: Backend — Demand-Driven Posts (Q2)
- [ ] 2.1 All created posts are `type: REQUEST` (even if `type: OFFER` sent)
- [ ] 2.2 Prisma default: `Post.type @default(REQUEST)`

### Step 3: Backend — Security (Q5, Q6)
- [ ] 3.1 `GET /api/posts` requires auth → `401` without token
- [ ] 3.2 `GET /api/posts/:id` requires auth → `401` without token
- [ ] 3.3 Post response excludes `phone` and exact `lat`/`lng`
- [ ] 3.4 CORS blocks unknown origins; allows `localhost:5173`

### Step 4: Backend — Swap Lifecycle (Q3)
- [ ] 4.1 Create swap → `status: PENDING`
- [ ] 4.2 Legal transition `PENDING → ACCEPTED` → `200`
- [ ] 4.3 Illegal `PENDING → COMPLETED` rejected → `400`
- [ ] 4.4 Illegal `PENDING → ACTIVE` rejected → `400`

### Step 5: Frontend — Web Views
- [ ] 5.1 Home feed shows requests only (no "offer" posts)
- [ ] 5.2 Add post modal sends `type: REQUEST` for borrow/donation/urgent
- [ ] 5.3 My Swaps loads real ratings from `/api/ratings` (no hardcoded `4.9`)
- [ ] 5.4 Profile charts show empty "coming soon" state (no fake numbers)
- [ ] 5.5 No hardcoded default user ('ياسين جمال' / '+963 944 123 456')

### Step 6: Frontend — Admin Dashboard (Q7)
- [ ] 6.1 `/admin` redirects to `/` unless `userType === 'committee'`
- [ ] 6.2 User management: warn, block, activate, promote
- [ ] 6.3 Ticket & initiative moderation: resolve tickets, approve/reject initiatives

### ✅ Phase 1 Sign-Off
_All Step 1–6 checkpoints passed. Web app is solid._

---

## Phase 2: Mobile App

### Step 7: Mobile — Auth
- [ ] 7.1 Login authenticates by phone
- [ ] 7.2 Auth interceptor attaches `Authorization: Bearer <token>` to every API call

### Step 8: Mobile — Posts & Map (primary client)
- [ ] 8.1 Home feed loads posts from backend
- [ ] 8.2 Map shows posts as markers at coordinates
- [ ] 8.3 Map falls back to Damascus (33.5138, 36.2765) if geolocation denied

### Step 9: Mobile — Swaps (Q3 enum alignment)
- [ ] 9.1 Swap statuses match backend enum: `PENDING`, `ACCEPTED`, `ACTIVE`, `COMPLETED`, `CANCELLED`
- [ ] 9.2 Accept swap → `ACCEPTED`
- [ ] 9.3 Complete swap → `COMPLETED`
- [ ] 9.4 Cancel → `CANCELLED`

### ✅ Phase 2 Sign-Off
_All Step 7–9 checkpoints passed. Mobile is ready for production._

---

## How to Run

```bash
# 1. Start backend
cd backend && npm run start:dev

# 2. Start web (in another terminal)
cd frontend && npm run dev   → http://localhost:5173

# 3. Start mobile (in another terminal)
cd haretna_mobile && flutter run

# 4. Push after every verified step
git push origin main
```

**Rule:** Push to `https://github.com/bassam-j3/hertna.git` after every step is verified.
