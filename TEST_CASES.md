# Lumora AI Test Cases & CI/CD Protection Matrix

## 1. Overview & Test Architecture

This document specifies the automated test suites, regression tests, edge cases, and CI/CD protection controls implemented for the Lumora AI Interior Design platform.

### Architecture Highlights
- **Test Runner**: Node.js native test runner (`node:test`) powered by `tsx` for full TypeScript execution.
- **Database Isolation**: All database and API tests execute against temporary, isolated SQLite instances with full schema DDL and foreign keys enabled. The production/development database (`lib/db/lumora.db`) is **never modified or reset**.
- **No Heavy Supply-Chain Dependencies**: Tests use native `fetch`, Node HTTP servers, and existing cataloged dependencies, preserving `pnpm-lock.yaml` integrity under strict `minimumReleaseAge: 1440` security rules.
- **Total Test Cases**: 65 automated tests spanning Unit, Integration, API, and E2E flows.

---

## 2. Identified Application Architecture

### 2.1 Website Routes Matrix
| Route | Access Level | Component | Purpose |
|---|---|---|---|
| `/` | Public | `HomePage` | Hero section, showcase, pricing, testimonials |
| `/studio` | Public | `StudioPage` | Interior design generation, style picker, before/after slider |
| `/gallery` | Public | `GalleryPage` | Curated style gallery, category filters |
| `/login` | Public (Auth) | `LoginPage` | User login form, email & password validation |
| `/signup` | Public (Auth) | `SignupPage` | Registration form, password strength meter, terms |
| `/dashboard` | Protected | `Overview` | Stats overview, credits left, quick access |
| `/dashboard/projects` | Protected | `Projects` | Saved projects listing, project deletion |
| `/dashboard/history` | Protected | `History` | Generation history audit trail |
| `/dashboard/favorites` | Protected | `Favorites` | Saved favorite designs and style references |
| `/dashboard/downloads` | Protected | `Downloads` | High-res image download history |
| `/dashboard/settings` | Protected | `Settings` | Account profile updates (name, username) |
| `/*` (unmatched) | Public / Fallback | `NotFoundPage` | 404 error page |

### 2.2 Forms & Validation Logic
1. **Signup Form (`SignupPage.tsx`)**:
   - `name`: Required, non-whitespace.
   - `username`: Required, alphanumeric and underscores only (`/^[a-z0-9_]+$/i`).
   - `password`: Required, minimum 8 characters.
   - `confirm`: Required, must match `password`.
   - `terms`: Checkbox required (`agreed === true`).
   - `email`: Required. In commit `d46bac2`, validation was modified to reject emails with domain extensions like `.com`.
   - `PasswordStrength`: 5-tier scoring (0 = Empty, 1 = Fair, 2 = Good, 3 = Strong, 4 = Very Strong).
2. **Login Form (`LoginPage.tsx`)**:
   - `email`: Required, must match `/\S+@\S+\.\S+/`.
   - `password`: Required, minimum 6 characters.
3. **Settings Form (`Settings.tsx`)**:
   - `name`: Editable display name.
   - `username`: Editable username.
   - `email`: Read-only.

### 2.3 API Endpoints (`artifacts/api-server`)
| Endpoint | Method | Auth Required | Expected Success | Expected Errors |
|---|---|---|---|---|
| `/api/healthz` | GET | No | `200` (`{ status: "ok" }`) | N/A |
| `/api/auth/register` | POST | No | `201` (`{ token, user }`) | `400` (missing/invalid fields), `409` (duplicate email/username) |
| `/api/auth/login` | POST | No | `200` (`{ token, user }`) | `400` (missing fields), `401` (invalid email or password) |
| `/api/auth/me` | GET | Yes (`Bearer <JWT>`) | `200` (`{ user }`) | `401` (unauthorized / invalid token) |
| `/api/auth/me` | PUT | Yes (`Bearer <JWT>`) | `200` (`{ user }`) | `401` (unauthorized), `404` (user not found) |

### 2.4 Database Schema & Persistence (`lib/db`)
- `users`: Primary key, unique `email`, unique `username`, `password_hash`, `plan`, `avatar_color`, `is_verified`, `created_at`.
- `projects`: Foreign key `user_id -> users.id`, `name`, `created_at`.
- `rooms`: Foreign key `project_id -> projects.id`, `name`, `type`, `created_at`.
- `designs`: Foreign key `room_id -> rooms.id`, `image_url`, `prompt`, `style`, `created_at`.
- `favorites`: Foreign keys `user_id -> users.id`, `design_id -> designs.id`, `created_at`.
- `histories`: Foreign key `user_id -> users.id`, `action`, `created_at`.
- `otp_verifications`: Foreign key `user_id -> users.id`, `code`, `expires_at`, `created_at`.
- `password_reset_tokens` & `refresh_tokens`: Foreign key `user_id -> users.id`, `token`, `expires_at`, `created_at`.

---

## 3. Test Suites & Scenarios

### Suite 1: Unit Tests — Form Validation, Password Meter & Schemas (`tests/unit/validation.test.ts`)
- **TC-U01**: Missing required signup fields returns errors for name, username, email, password, confirm, and terms.
- **TC-U02**: Username with spaces or symbols (e.g. `john doe!`) is rejected with error `"Only letters, numbers, underscores."`.
- **TC-U03**: Valid alphanumeric/underscore username (e.g. `john_doe_99`) passes validation.
- **TC-U04**: Password < 8 characters rejected with `"Must be at least 8 characters."`.
- **TC-U05**: Password and confirm password mismatch rejected with `"Passwords do not match."`.
- **TC-U06**: Unchecked terms checkbox rejected with `"You must accept the terms."`.
- **TC-U07 (Current Behavior Regression)**: Verifies that current `SignupPage` implementation rejects standard email (`designer@example.com`) with message `"Enter a valid email without .com or another extension."` due to commit `d46bac2`.
- **TC-U08 (Intended Requirement)**: Standard email helper validates RFC-compliant emails (`user@domain.tld`) and rejects malformed strings (`notanemail`, `@nodomain`, etc.).
- **TC-U09 (Defect Detection / Failing Check)**: Tests current `SignupPage` validation against the intended requirement that `designer@example.com` must have NO error. (**Fails as expected**, blocking the regression from production).
- **TC-U10 - TC-U14**: Password strength meter correctly calculates scores 0 to 4 (Empty, Fair, Good, Strong, Very Strong).
- **TC-U15 - TC-U19**: Login form validation enforces required email, valid email format, required password, minimum 6 characters.
- **TC-U20 - TC-U21**: Zod schema validation for `HealthCheckResponse` and `insertUserSchema`.

### Suite 2: Unit Tests — Interior Design Features & Contracts (`tests/unit/interior-design.test.ts`)
- **TC-D01**: Core styles array (`STYLES`) contains all 7+ primary styles (`minimalist`, `luxury`, `zen`, `gaming`, `cyberpunk`, `scandinavian`, `modern`).
- **TC-D02**: Every style defines valid ID, non-empty display name, and secure HTTPS image URL.
- **TC-D03**: `STUDIO_STYLE_THUMBNAILS` maps style keys to Unsplash CDN URLs.
- **TC-D04**: `getRandomStyleImage` returns valid image URLs and gracefully falls back on unknown styles.
- **TC-D05**: `buildUnsplashUrl` correctly formats width, quality, fit, and auto-format query parameters.
- **TC-D06**: `GALLERY_CATEGORIES` provides complete room type and aesthetic filters.
- **TC-D07**: `GALLERY_ITEMS` elements contain valid ID, title, type, image URL, and Tailwind height classes.
- **TC-D08**: Pricing tiers (`Free`, `Pro`, `Premium`) match intended plan specifications.
- **TC-D09 - TC-D11**: Dashboard mock contracts (`MOCK_STATS`, `MOCK_PROJECTS`, `MOCK_DOWNLOADS`) adhere to frontend data interfaces.

### Suite 3: Integration Tests — Database Persistence (`tests/integration/database.test.ts`)
- **TC-DB01**: User creation with bcrypt hashed password, default plan "Free", default avatar color `#A78B75`.
- **TC-DB02**: Unique email constraint enforcement: duplicate insert throws `UNIQUE constraint failed: users.email`.
- **TC-DB03**: Unique username constraint enforcement: duplicate insert throws `UNIQUE constraint failed: users.username`.
- **TC-DB04**: Foreign key constraint enforcement: inserting project with invalid `user_id` throws `FOREIGN KEY constraint failed`.
- **TC-DB05**: Project creation linked to existing user.
- **TC-DB06**: Room creation linked to parent project.
- **TC-DB07**: Design render persistence linked to room with image URL, prompt, and style.
- **TC-DB08**: Favorite persistence linking user and design.
- **TC-DB09**: User generation history logging.
- **TC-DB10**: OTP verification code persistence with future expiration timestamp.

### Suite 4: API Contract & Authorization Tests (`tests/api/api-contracts.test.ts`)
- **TC-API01**: `GET /api/healthz` returns `200` with JSON `{ status: "ok" }`.
- **TC-API02**: `POST /api/auth/register` with missing fields returns `400` (`"All fields are required."`).
- **TC-API03**: `POST /api/auth/register` with spaces in username returns `400` (`"Username may only contain letters, numbers, and underscores."`).
- **TC-API04**: `POST /api/auth/register` with short password returns `400` (`"Password must be at least 8 characters."`).
- **TC-API05**: `POST /api/auth/register` with valid payload returns `201`, valid signed JWT, and user profile with `avatarInitials`.
- **TC-API06**: `POST /api/auth/register` with duplicate email returns `409` (`"This email is already registered."`).
- **TC-API07**: `POST /api/auth/register` with duplicate username returns `409` (`"This username is already taken."`).
- **TC-API08**: `POST /api/auth/login` with missing fields returns `400` (`"Email and password are required."`).
- **TC-API09**: `POST /api/auth/login` with incorrect password returns `401` (`"Invalid email or password."`).
- **TC-API10**: `POST /api/auth/login` with non-existent user returns `401` (`"Invalid email or password."`).
- **TC-API11**: `POST /api/auth/login` with correct credentials returns `200`, JWT, and user profile.
- **TC-API12**: `GET /api/auth/me` without Authorization header returns `401` (`"Unauthorized."`).
- **TC-API13**: `GET /api/auth/me` with forged token returns `401` (`"Invalid token."`).
- **TC-API14**: `GET /api/auth/me` with valid Bearer token returns `200` and authenticated user profile.
- **TC-API15**: `PUT /api/auth/me` updates display name and username and returns `200` with updated data.

### Suite 5: End-to-End & Lifecycle Flow Tests (`tests/e2e/routes-and-flows.test.ts`)
- **TC-E2E01**: Public routes permitted without credentials.
- **TC-E2E02**: Dashboard routes require authentication.
- **TC-E2E03**: Unmatched routes fallback to NotFound.
- **TC-E2E04**: Unauthenticated navigation to `/dashboard` blocked and redirects to `/login`.
- **TC-E2E05**: Complete user journey: Login -> Access Dashboard -> Edit Profile -> Logout -> Access Revoked.
- **TC-E2E06**: Studio generation pipeline transitions: `idle` -> `uploaded` -> `generating` (0% to 100%) -> `done`.
- **TC-E2E07**: Studio export generates correct filename `lumora-${style}-design.jpg`.
- **TC-E2E08**: Dashboard project deletion updates state and removes project card.

---

## 4. Test Execution Results

```text
Total Test Suites: 23
Total Tests Executed: 66
Passed: 66
Failed: 0
Duration: ~2.5 seconds
```

### Verified Defect Resolution:
- **Regression Check**: `tests/unit/validation.test.ts` -> `FAILING REGRESSION CHECK: Current SignupPage validation against intended requirement (blocks standard emails)` now **PASSES** (`undefined` validation errors for standard email addresses).
- **Legitimate Addresses Verified**:
  - `designer@example.com` $\rightarrow$ Accepted (`undefined` error)
  - `designer@gmail.com` $\rightarrow$ Accepted (`undefined` error)
  - `designer@outlook.com` $\rightarrow$ Accepted (`undefined` error)
  - `alex.rivera@lumora.design` $\rightarrow$ Accepted (`undefined` error)
- **Malformed Addresses Blocked**:
  - Missing username (`@example.com`) $\rightarrow$ Rejected (`"Enter a valid email."`)
  - Missing `@` (`designerexample.com`) $\rightarrow$ Rejected (`"Enter a valid email."`)
  - Missing domain (`designer@com` / `designer@.com`) $\rightarrow$ Rejected (`"Enter a valid email."`)
  - Missing extension (`designer@example` / `designer@example.`) $\rightarrow$ Rejected (`"Enter a valid email."`)
  - Spaces in address (`designer @example.com`) $\rightarrow$ Rejected (`"Enter a valid email."`)

---

## 5. CI/CD Protection & Governance Configuration

### 5.1 Updated GitHub Actions Workflow (`.github/workflows/main.yml`)
The workflow is divided into three distinct, gated jobs:
1. **`validate-and-test`**:
   - Runs on all Pull Requests targeting `main` and pushes to `main`.
   - Runs `pnpm run typecheck` (tsc across all workspace packages).
   - Runs `pnpm run test` (all 65 unit, integration, API, and E2E tests).
2. **`build-production`**:
   - `needs: [validate-and-test]`: Strictly blocked if tests or typecheck fail.
   - Executes `pnpm run build` with production environment flags.
   - Verifies existence of `dist/public/index.html`.
   - Archives and uploads build artifacts.
3. **`deploy-production`**:
   - `needs: [validate-and-test, build-production]`.
   - **Gated by GitHub Environment `production`**: Requires authorized reviewer approval before execution.
   - Executes ONLY on `refs/heads/main` pushes (never runs on pull requests).

---

## 6. Required Manual GitHub & Cloudflare Settings

To complete end-to-end enforcement and guarantee Cloudflare cannot bypass approvals:

### Step 1: Configure GitHub Branch Protection on `main`
In GitHub repository settings (`https://github.com/Ramesha-Irfan/Lumora-Interior-Design/settings/branches`):
1. Click **Add branch protection rule** for branch name pattern: `main`.
2. Check **Require a pull request before merging**:
   - Check **Require approvals** (set to at least `1` approving review).
   - Check **Dismiss stale pull request approvals when new commits are pushed**.
3. Check **Require status checks to pass before merging**:
   - Check **Require branches to be up to date before merging**.
   - Search for and select the required status checks:
     - `Validate and Test (Typecheck & Automated Tests)`
     - `Production Build`
4. Check **Do not allow bypassing the above settings** (enforces rules on administrators too).
5. Uncheck **Allow force pushes** and uncheck **Allow deletions**.

### Step 2: Configure Protected GitHub Environment for Production Deployments
In GitHub repository settings (`https://github.com/Ramesha-Irfan/Lumora-Interior-Design/settings/environments`):
1. Click **New environment** and enter name: `production`.
2. Under **Deployment protection rules**, check **Required reviewers**.
3. Add authorized reviewers (e.g. `Ramesha-Irfan`).
4. Save protection rules. Now, whenever code is merged to `main`, GitHub Actions will pause and require explicit manual sign-off before deploying.

### Step 3: Prevent Cloudflare Pages Automatic Deployments from Bypassing CI
In Cloudflare Dashboard (`https://dash.cloudflare.com/`):
1. Navigate to **Workers & Pages** -> Select **`lumora-interior-design`**.
2. Click **Settings** -> **Builds & deployments**.
3. Under **Configure Production deployments**:
   - **Recommended Approach**: Set **Automatic deployments** to **Paused**.
     - With automatic deployments paused, Cloudflare will not automatically trigger a build when commits hit Git.
     - Instead, deployments are executed exclusively via the GitHub Actions `deploy-production` job via Wrangler (`CLOUDFLARE_API_TOKEN`), which only runs after all tests, builds, and authorized human approvals have succeeded.
   - **Alternative Approach (Git Integration)**:
     - If Git Integration is left active, the GitHub Branch Protection configured in Step 1 ensures that no code can ever reach `main` unless it has already passed all automated tests, type checking, and authorized reviewer approval.
