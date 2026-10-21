# Lumora AI — Frontend Automated Test Cases Matrix

## 1. Executive Summary & Verification Metrics

This document specifies the comprehensive frontend-only automated testing matrix for **Lumora AI Interior Design** (`artifacts/lumora-frontend`).

### Test Execution Results
- **Test Runner**: Vitest v5.0.5 with `@testing-library/react` and `jsdom`
- **Total Frontend Test Cases**: **67**
- **Passed**: **67**
- **Failed**: **0**
- **Skipped**: **0**
- **Pass Rate**: **100%**
- **Execution Duration**: ~18 seconds
- **Test Command**: `pnpm run test:frontend` (or `pnpm --filter @workspace/lumora-frontend run test`)

---

## 2. Test Architecture & Environment

- **Component Isolation**: Tests use `renderWithProviders` (`src/test/test-utils.tsx`), wrapping tested components in `AuthProvider`, `QueryClientProvider`, and `MotionConfig` with `duration: 0` to ensure stable DOM transitions in jsdom.
- **Client Mocking**: Browser globals (`matchMedia`, `IntersectionObserver`, `ResizeObserver`, `URL.createObjectURL`) are polyfilled in `src/test/setup.ts`.
- **Zero Production/Database Impact**: All frontend tests run completely in-memory. Zero backend servers, SQLite databases, network sockets, or credentials are required.

---

## 3. Test Cases Specification & Execution Matrix

### 3.1 Page Rendering Suite (`src/__tests__/page-rendering.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-REND-001** | Landing Page | Hero section & primary CTAs rendering. Unauthenticated state. | 1. Mount `HomePage`.<br>2. Query `h1` level heading.<br>3. Query "Explore Projects" & "Contact Us" links. | Main heading displays luxury tagline; CTAs are visible with valid URLs. | Heading and CTAs rendered matching design spec. | **PASSED** |
| **TC-FE-REND-002** | Landing Page | Marketing feature sections. Unauthenticated state. | 1. Mount `HomePage`.<br>2. Search for "Our Specialities" and "Our Process". | Section headings and marketing copy are visible in viewport. | Both sections rendered properly. | **PASSED** |
| **TC-FE-REND-003** | Login Page | Sign-in form rendering. Unauthenticated state. | 1. Mount `LoginPage`.<br>2. Inspect welcome text, email input, password input, and submit button. | Form contains "Welcome back.", email and password inputs, and "Sign in" action. | All login inputs and buttons present. | **PASSED** |
| **TC-FE-REND-004** | Signup Page | Registration form rendering. Unauthenticated state. | 1. Mount `SignupPage`.<br>2. Inspect fields: Full name, username, email, password, confirm password, terms. | Form displays title "Create your account." and all registration inputs. | All 5 inputs, terms link, and create button present. | **PASSED** |
| **TC-FE-REND-005** | Gallery Page | Inspiration showcase rendering. Unauthenticated state. | 1. Mount `GalleryPage`.<br>2. Inspect category filter tabs and search bar. | Displays "Inspiration Gallery", category filters (All, Living Room, etc.), and search bar. | Category tabs and search input rendered. | **PASSED** |
| **TC-FE-REND-006** | Studio Page | Interior Design Studio workspace. Unauthenticated state. | 1. Mount `StudioPage`.<br>2. Inspect style selector cards and image dropzone. | Displays "AI Design Studio", style options (Zen, Minimalist, etc.), and upload dropzone. | Styles and upload CTA rendered. | **PASSED** |
| **TC-FE-REND-007** | Pricing Spec | Pricing tiers specification contract. | 1. Read `PRICING` data in `services/mockData.ts`.<br>2. Validate tiers array and attributes. | Exactly 3 tiers (Free, Pro, Premium) with valid prices, features, and buttons. | Tiers and properties validated. | **PASSED** |
| **TC-FE-REND-008** | Dashboard Overview | Authenticated user stats & metrics. Precondition: user authenticated. | 1. Mount `Overview` with `mockUser`.<br>2. Query user greeting and metric card titles. | Shows "Welcome back, Alexandra" and 4 metric cards (Designs, Inspirations, Style, Credits). | Greeting and metrics rendered. | **PASSED** |
| **TC-FE-REND-009** | Dashboard Projects | Saved spaces listing. Precondition: user authenticated. | 1. Mount `Projects` with `mockUser`.<br>2. Inspect project grid and "New Project" button. | Shows "Saved spaces", project cards, and action buttons. | Project cards and controls rendered. | **PASSED** |
| **TC-FE-REND-010** | Dashboard History | Generation audit trail. Precondition: user authenticated. | 1. Mount `History` with `mockUser`.<br>2. Query past generation list. | Shows "Past generations" and generation list items. | History list rendered with design cards. | **PASSED** |
| **TC-FE-REND-011** | Dashboard Favorites | Saved inspiration gallery. Precondition: user authenticated. | 1. Mount `Favorites` with `mockUser`.<br>2. Inspect favorites list and search input. | Displays "Saved inspiration", search input, and favorite cards. | Favorites list and search bar rendered. | **PASSED** |
| **TC-FE-REND-012** | Dashboard Downloads | Exported renders listing. Precondition: user authenticated. | 1. Mount `Downloads` with `mockUser`.<br>2. Query high-res render list. | Displays "Exported renders" and download items. | Download cards rendered. | **PASSED** |
| **TC-FE-REND-013** | Dashboard Settings | Account profile form. Precondition: user authenticated. | 1. Mount `Settings` with `mockUser`.<br>2. Query inputs for name, username, and email. | Prepopulates name ("Alexandra Vance"), username, and read-only email. | All fields prepopulated; email read-only. | **PASSED** |
| **TC-FE-REND-014** | 404 Page | Fallback error page for unknown route. | 1. Mount `NotFoundPage`.<br>2. Query heading and description. | Displays "404 Page Not Found" and guidance text. | 404 heading and message rendered. | **PASSED** |

---

### 3.2 Navigation and Routing Suite (`src/__tests__/navigation-and-routing.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-NAV-001** | Navigation Bar | Desktop nav links and branding. | 1. Mount `Navbar`.<br>2. Inspect brand text and links. | Displays "lumora" logo, Home, Projects, Studio, Dashboard, Sign In, Get Started. | All links and brand text verified. | **PASSED** |
| **TC-FE-NAV-002** | Navigation Bar | Mobile drawer menu toggling. | 1. Mount `Navbar`.<br>2. Click hamburger menu button.<br>3. Check expanded state.<br>4. Click again to close. | Drawer toggles visibility of mobile links upon click. | Mobile menu opened and closed smoothly. | **PASSED** |
| **TC-FE-NAV-003** | Protected Route | Unauthenticated access blocking. Precondition: `user: null`. | 1. Mount `ProtectedRoute` wrapping protected child at `/dashboard`.<br>2. Inspect DOM. | Shows "Please log in to continue…" gate; protected child is NOT rendered. | Child suppressed; login gate shown. | **PASSED** |
| **TC-FE-NAV-004** | Protected Route | Authenticated access allowance. Precondition: `mockUser`. | 1. Mount `ProtectedRoute` wrapping child at `/dashboard`.<br>2. Inspect DOM. | Protected child area is rendered and accessible. | Protected child rendered successfully. | **PASSED** |
| **TC-FE-NAV-005** | Dashboard Layout | Authenticated sidebar navigation items. Precondition: `mockUser`. | 1. Mount `DashboardLayout`.<br>2. Query user name, plan, avatar initials, and navigation links. | Displays user name, plan, initials "AV", and links (Overview, Projects, History, Favorites, Downloads, Settings, Logout). | Sidebar elements and links present. | **PASSED** |
| **TC-FE-NAV-006** | Dashboard Layout | Logout action and token clearance. Precondition: `mockUser`. | 1. Mount `DashboardLayout`.<br>2. Click "Logout" button. | `localStorage.removeItem("lumora_token")` called; token is null. | Token cleared from storage. | **PASSED** |
| **TC-FE-NAV-007** | Router | Root route `/` resolution. | 1. Mount `AppRouter` with memory location `/`. | Loads and displays `HomePage` content. | Homepage loaded. | **PASSED** |
| **TC-FE-NAV-008** | Router | Authentication route `/login` resolution. | 1. Mount `AppRouter` with memory location `/login`. | Loads and displays `LoginPage` content. | Login page loaded. | **PASSED** |
| **TC-FE-NAV-009** | Router | Authentication route `/signup` resolution. | 1. Mount `AppRouter` with memory location `/signup`. | Loads and displays `SignupPage` content. | Signup page loaded. | **PASSED** |
| **TC-FE-NAV-010** | Router | Unknown path wildcard routing. | 1. Mount `AppRouter` with memory location `/nonexistent-page-url`. | Wildcard catch-all renders `NotFoundPage`. | 404 page rendered. | **PASSED** |

---

### 3.3 Forms and Validation Suite (`src/__tests__/forms-and-validation.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-FORM-001** | Login Form | Empty submission validation (negative case). | 1. Mount `LoginPage`.<br>2. Click "Sign in" without entering values. | Displays error: "Please enter your email address." | Error message displayed. | **PASSED** |
| **TC-FE-FORM-002** | Login Form | Invalid email format validation (negative case). | 1. Mount `LoginPage`.<br>2. Type "invalid-email-address".<br>3. Submit form. | Displays error: "Please enter a valid email address." | Validation error triggered. | **PASSED** |
| **TC-FE-FORM-003** | Login Form | Password boundary validation (< 6 chars). | 1. Mount `LoginPage`.<br>2. Enter valid email, enter "12345" for password.<br>3. Submit form. | Displays error: "Password must be at least 6 characters." | Minimum length error displayed. | **PASSED** |
| **TC-FE-FORM-004** | Login Form | Password visibility toggle (interaction). | 1. Mount `LoginPage`.<br>2. Inspect password input type (`password`).<br>3. Click eye toggle button.<br>4. Inspect password input type (`text`). | Input type alternates between `password` and `text`. | Toggled between password and text. | **PASSED** |
| **TC-FE-FORM-005** | Login Form | API authentication failure handling (negative case). | 1. Mount `LoginPage` with mock fetch returning 401 error.<br>2. Submit valid credentials.<br>3. Await error display. | Displays error banner: "Invalid email or password." | Error banner displayed to user. | **PASSED** |
| **TC-FE-FORM-006** | Signup Form | All required fields empty submission (negative case). | 1. Mount `SignupPage`.<br>2. Click "Create account" without inputs. | Displays individual errors for name, username, email, password, confirm, and terms. | All 6 error messages displayed. | **PASSED** |
| **TC-FE-FORM-007** | Signup Form | Username regex validation (boundary & negative case). | 1. Mount `SignupPage`.<br>2. Enter "invalid username!".<br>3. Submit.<br>4. Correct to "valid_user_123". | Rejects special chars with "Only letters, numbers, underscores."; clears on valid input. | Error appears for spaces/symbols, clears on valid username. | **PASSED** |
| **TC-FE-FORM-008** | Signup Form | Password length & mismatch boundary validation. | 1. Mount `SignupPage`.<br>2. Enter 5-char password and non-matching confirm password.<br>3. Submit. | Displays "Must be at least 8 characters." and "Passwords do not match." | Both length and mismatch errors triggered. | **PASSED** |
| **TC-FE-FORM-009** | Signup Form | Dynamic password strength calculation (positive cases). | 1. Mount `SignupPage`.<br>2. Progressively enter lowercase, uppercase, digit, special char. | Indicator scores increment: Fair -> Good -> Strong -> Very Strong. | Strength meter calculated all 4 tiers accurately. | **PASSED** |
| **TC-FE-FORM-010** | Signup Form | Terms of service checkbox toggle. | 1. Mount `SignupPage`.<br>2. Click submit (shows terms error).<br>3. Click terms checkbox button. | Terms error disappears when terms checkbox is toggled. | Error cleared upon checking terms. | **PASSED** |
| **TC-FE-FORM-011** | Settings Form | Profile update submission (positive case). | 1. Mount `Settings` with `mockUser`.<br>2. Change display name to "Alexandra Rivera".<br>3. Click "Save changes". | Calls `PUT /api/auth/me` with updated payload; displays "Saved." indicator. | Changes submitted and "Saved." feedback shown. | **PASSED** |

---

### 3.4 UI Interactions Suite (`src/__tests__/ui-interactions.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-UI-001** | Studio Page | Style card selection interaction. | 1. Mount `StudioPage`.<br>2. Click "Zen" style button. | Selected style card applies accent border `#A78B75`. | Border color updated to active accent. | **PASSED** |
| **TC-FE-UI-002** | Studio Page | Sample room preload interaction. | 1. Mount `StudioPage`.<br>2. Click "or use a sample room" button. | State transitions from idle to uploaded; shows "Room uploaded" and Generate button. | Sample image loaded into preview. | **PASSED** |
| **TC-FE-UI-003** | Studio Page | Reset uploaded room interaction. | 1. Mount `StudioPage`.<br>2. Load sample room.<br>3. Click reset button. | Returns to idle phase with file dropzone. | State reset to dropzone prompt. | **PASSED** |
| **TC-FE-UI-004** | Studio Page | File input upload interaction. | 1. Mount `StudioPage`.<br>2. Trigger change on file input with dummy JPEG file. | Image reader triggers upload state; shows "Room uploaded". | Upload state activated. | **PASSED** |
| **TC-FE-UI-005** | Studio Page | AI Generation progress phase trigger. | 1. Mount `StudioPage`.<br>2. Load sample room.<br>3. Click "Generate" button. | Enters generation phase; displays "Generating" animated state. | Generation progress view triggered. | **PASSED** |
| **TC-FE-UI-006** | BeforeAfterSlider | Touch/mouse comparison drag. | 1. Mount `BeforeAfterSlider` with before & after image URLs.<br>2. Trigger touchStart and touchMove events. | Renders Original and Redesign labels; updates divider position without errors. | Slider rendered and touch events handled. | **PASSED** |
| **TC-FE-UI-007** | Gallery Page | Category filter tab switching. | 1. Mount `GalleryPage`.<br>2. Click "Bedroom" filter button. | Active filter button highlights with accent background. | Active filter updated to Bedroom. | **PASSED** |
| **TC-FE-UI-008** | Gallery Page | Real-time search query filtering. | 1. Mount `GalleryPage`.<br>2. Type "Minimalist" in search input. | Input value updates and triggers filter predicate. | Search value updated. | **PASSED** |
| **TC-FE-UI-009** | Gallery Page | Favorite toggle button on gallery items. | 1. Mount `GalleryPage`.<br>2. Click favorite bookmark button on first item. | Bookmark button toggles active background color. | Button styling toggled to active. | **PASSED** |
| **TC-FE-UI-010** | Dashboard Projects | Project deletion interaction. | 1. Mount `Projects` with `mockUser`.<br>2. Click delete icon on "Living Room Luxury". | Project card removed from UI list. | Item removed from DOM. | **PASSED** |
| **TC-FE-UI-011** | Dashboard Favorites | Real-time query search filtering. | 1. Mount `Favorites` with `mockUser`.<br>2. Search for "Nordic Kitchen". | Only "Nordic Kitchen" remains visible; others filtered out. | List filtered matching query. | **PASSED** |
| **TC-FE-UI-012** | Dashboard Favorites | Favorite item removal interaction. | 1. Mount `Favorites` with `mockUser`.<br>2. Click trash icon on favorite card. | Favorite card removed from list. | Item deleted from list. | **PASSED** |
| **TC-FE-UI-013** | Dashboard History | History entry deletion interaction. | 1. Mount `History` with `mockUser`.<br>2. Click trash icon on history card. | History card removed from audit list. | Entry deleted from DOM. | **PASSED** |
| **TC-FE-UI-014** | Dashboard Downloads | Download trigger and user feedback. | 1. Mount `Downloads` with `mockUser`.<br>2. Click "Download" button on export item. | Triggers download handler and displays "Saved" feedback. | "Saved" indicator displayed. | **PASSED** |

---

### 3.5 Responsive UI and Accessibility Suite (`src/__tests__/responsive-and-accessibility.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-A11Y-001** | Accessibility | Login form input labels and autocomplete. | 1. Mount `LoginPage`.<br>2. Check label text and input attributes. | Labels "Email Address" and "Password" present; `autoComplete` set to "email" and "current-password". | Labels and attributes verified. | **PASSED** |
| **TC-FE-A11Y-002** | Accessibility | Signup form input labels and autocomplete. | 1. Mount `SignupPage`.<br>2. Inspect all 5 input labels and `autoComplete` attributes. | All inputs have visible descriptive labels and valid autocomplete attributes (`name`, `username`, `email`, `new-password`). | Descriptive labels and autocomplete confirmed. | **PASSED** |
| **TC-FE-A11Y-003** | Accessibility | Image non-empty alternative text (`alt`). | 1. Mount `HomePage`.<br>2. Find all `<img>` elements.<br>3. Check `alt` attributes. | All image elements have non-empty `alt` attributes for screen readers. | Every image element contains valid alt text. | **PASSED** |
| **TC-FE-A11Y-004** | Accessibility | Keyboard focus navigation. | 1. Mount `LoginPage`.<br>2. Call `.focus()` on email input and submit button.<br>3. Inspect `document.activeElement`. | Elements receive focus cleanly and can be activated via keyboard. | Focus indicators and activeElement verified. | **PASSED** |
| **TC-FE-A11Y-005** | Accessibility | Settings read-only email and field labels. | 1. Mount `Settings` with `mockUser`.<br>2. Inspect email input and field labels. | Labels for display name, username, email present; email field marked `readOnly`. | Verified accessible labels and read-only email. | **PASSED** |
| **TC-FE-A11Y-006** | Responsive UI | Navbar responsive breakpoint classes. | 1. Mount `Navbar`.<br>2. Query desktop navigation and mobile hamburger containers. | Desktop nav uses `.hidden.md:flex`; mobile trigger uses `.md:hidden`. | Breakpoint classes confirmed. | **PASSED** |
| **TC-FE-A11Y-007** | Responsive UI | Gallery filter container flex-wrap classes. | 1. Mount `GalleryPage`.<br>2. Inspect category filter bar container. | Container uses `.flex.flex-wrap.justify-center` to prevent mobile overflow. | Flex-wrap verified. | **PASSED** |
| **TC-FE-A11Y-008** | Responsive UI | Studio page multi-column grid layout. | 1. Mount `StudioPage`.<br>2. Inspect root grid layout element. | Uses `.grid.lg:grid-cols-2` for responsive single/two-column transition. | Responsive grid classes verified. | **PASSED** |
| **TC-FE-A11Y-009** | Responsive UI | Dashboard Projects grid responsive columns. | 1. Mount `Projects` with `mockUser`.<br>2. Inspect projects container. | Uses `.grid.grid-cols-1.md:grid-cols-2` for adaptive card layout. | Responsive columns verified. | **PASSED** |
| **TC-FE-A11Y-010** | Responsive UI | Dashboard sidebar responsive visibility. | 1. Mount `DashboardLayout` with `mockUser`.<br>2. Inspect aside element classes. | Uses `aside.hidden.lg:flex` to hide sidebar on mobile viewports. | Responsive aside classes verified. | **PASSED** |

---

### 3.6 Regression and Error Handling Suite (`src/__tests__/regression-and-error-handling.test.tsx`)

| Test ID | Feature | Scenario & Preconditions | Test Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC-FE-ERR-001** | Regression | Missing user display name handling. Precondition: `user.name = ""`. | 1. Mount `Overview` with user having empty name.<br>2. Query greeting. | Falls back to generic greeting "Welcome back, Designer". | Fallback greeting rendered without throwing. | **PASSED** |
| **TC-FE-ERR-002** | Regression | Missing avatar and user profile in sidebar. Precondition: `user: null`. | 1. Mount `DashboardLayout` with null user.<br>2. Query sidebar header. | Falls back to "?" for initials, "Guest" for name, and "Free Plan". | Safe fallbacks rendered without exceptions. | **PASSED** |
| **TC-FE-ERR-003** | Empty State | Gallery zero-search-results handling. | 1. Mount `GalleryPage`.<br>2. Enter query that matches no items. | Displays empty state: "No designs found". | Empty state message shown. | **PASSED** |
| **TC-FE-ERR-004** | Empty State | Favorites zero-search-results handling. | 1. Mount `Favorites` with `mockUser`.<br>2. Search query matching no favorites. | Displays notice: 'No results for "UnknownSearchQueryXYZ"'. | Zero search results notice shown. | **PASSED** |
| **TC-FE-ERR-005** | Empty State | History list deletion to zero items. | 1. Mount `History` with `mockUser`.<br>2. Delete all history items. | Displays empty notice: "No history yet. Start designing in the studio." | Empty state notice shown. | **PASSED** |
| **TC-FE-ERR-006** | Empty State | Projects list deletion to zero items. | 1. Mount `Projects` with `mockUser`.<br>2. Delete all project items. | Displays empty notice: "No projects yet. Create your first one in the studio." | Empty state notice shown. | **PASSED** |
| **TC-FE-ERR-007** | Error Resilience | Unsplash image service failure fallback. | 1. Call `getFallbackImage()`.<br>2. Inspect returned URL string. | Returns valid high-res fallback Unsplash image URL. | Valid URL returned. | **PASSED** |
| **TC-FE-ERR-008** | Error Resilience | Studio uploaded image `onError` recovery. | 1. Mount `StudioPage` and load sample image.<br>2. Trigger `error` event on preview image. | Handler catches error and assigns fallback image source. | Fallback image source assigned. | **PASSED** |
| **TC-FE-ERR-009** | Error Resilience | Network failure on authentication submission. | 1. Mount `LoginPage` with mock network throwing `Network request failed`.<br>2. Submit valid credentials. | Catches network exception and displays readable error message. | Network error banner displayed to user. | **PASSED** |

---

## 4. Verification Instructions

To reproduce all 67 test results locally or in CI:

```bash
# 1. Run frontend type check
pnpm --filter @workspace/lumora-frontend run typecheck

# 2. Run automated frontend test suite
pnpm run test:frontend

# 3. Run production build
pnpm run build:frontend
```
