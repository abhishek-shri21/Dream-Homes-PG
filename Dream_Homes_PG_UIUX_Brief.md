# Dream Homes PG — UI/UX Brief

**Product:** PG (Paying Guest) accommodation platform — tenant-facing booking/support app + owner/admin dashboard
**Market:** Jodhpur, Rajasthan — student & young-professional co-living
**Platforms:** Responsive web (mobile-first, desktop bento layouts), Material Design 3 token system via Tailwind

---

## 1. Design System

### 1.1 Color Roles (Material 3 token naming)
| Role | Hex | Usage |
|---|---|---|
| Primary | `#004790` | Brand royal blue — CTAs, nav active state, headings |
| Primary Container | `#1a5fb4` | Filled badges, stat cards |
| Secondary | `#944a00` | Warm accent — WiFi/alert icons, secondary CTA |
| Secondary Container | `#fc8f34` | Payment CTA, price-related accents |
| Error | `#ba1a1a` | High-priority tags, curfew/warning chips |
| Background | `#f8f9fa` | App canvas |
| Surface / Surface Container tiers | `#ffffff → #e7e8e9` | Card elevation hierarchy (lowest → highest) |
| On-Surface Variant | `#424752` | Secondary text |
| Outline / Outline Variant | `#727783` / `#c2c6d4` | Borders, dividers |

**Gap:** No dark-mode token values are wired despite `darkMode:"class"` being enabled — dark surface/on-surface pairs need defining before a dark theme can ship.

### 1.2 Typography
- **Display/Headline:** Montserrat (600/700) — bold, editorial, used for hero titles, prices, section headers
- **Body/Label:** Inter (400/600) — used for paragraphs, form labels, chips
- Scale runs Display-lg (48px) → Headline-lg (32px) → Headline-md (24px) → Body-lg (18px) → Body-md (16px) → Label-md (14px)

### 1.3 Spacing & Shape
- 4px base grid: `xs 8 · sm/margin-mobile 16 · md 24 · gutter 20 · lg 40 · xl 64`
- Radius: cards mostly `24px` (rounded-[24px]), pills `full`, inputs `lg (8px)`
- Elevation via soft ambient shadows (`rgba(0,71,144,0.05–0.08)`) rather than hard drop shadows — gives a "floating card" feel consistent across all screens

### 1.4 Recurring Components
- Sticky TopAppBar (icon + wordmark) + mobile BottomNavBar (4 tabs: Home/PGs/Complaints/Profile), desktop swaps to inline nav
- Bento-style asymmetric grids for hero/stat sections (Home, Admin Dashboard)
- Chip selectors (category, priority, room type, locality) with active/inactive state toggling
- Glassmorphism card (`backdrop-blur`) for form-heavy screens (Room Alerts, PG Booking payment)
- Vertical stepper/timeline for status tracking (Track Complaint)
- Radio-card pattern for room-type selection with inline pricing

---

## 2. Screens Inventory (7 screens found)

| # | Screen | Primary Job-to-be-Done |
|---|---|---|
| 1 | **Home** | Discover PGs, search by locality, trust-building (stats, testimonial-style "Why Us") |
| 2 | **PG Listing / Search (Design System file)** | Filter by locality/gender-type/budget, browse property cards |
| 3 | **PG Details & Booking** | View gallery, amenities, house rules, pick room type, pay via UPI |
| 4 | **Raise Complaint** | Log a maintenance ticket with category, priority, photo |
| 5 | **Track Complaint** | Search ticket ID, view status timeline, technician contact |
| 6 | **Room Alerts Subscription** | Opt in to WhatsApp/notification alerts for room availability |
| 7 | **Admin/Owner Dashboard** | Monitor metrics, resolve tickets, manage visitor leads |

---

## 3. Flow-by-Flow UX Notes

### Home → Listing → Details → Payment (Core conversion funnel)
- Good: locality search + quick-filter chips reduce friction early; sticky filter bar on listing keeps filters accessible while scrolling
- Good: room-type radio cards show price inline — no extra tap needed to compare Single/Double/Triple
- **Risk:** Payment section uses a static "Simulate Payment Confirmation" button with a faux QR — this is prototype-only; real UPI deep-link/payment gateway integration needed before production
- **Gap:** No booking confirmation screen/state shown post-payment (only a button, no success screen mocked)

### Complaint Raise → Track (Support funnel)
- Good: 3-step reduction (Location → Category chips → Priority chips) before free-text, minimizes typing on mobile
- Good: success modal shows Ticket ID immediately with a direct "Track Status" CTA — closes the loop well
- **Gap:** Track Complaint screen requires manually entering Ticket ID; no "My Complaints" list for a logged-in tenant to avoid re-typing/losing the ID
- **Gap:** Category chips (`hidden input required`) have no visible validation/error state if user skips selection before submit

### Room Alerts
- Good: WhatsApp opt-in pre-checked (aligns with high WhatsApp usage in target demographic) with brand-colored icon for recognizability
- **Gap:** No confirmation state after "Notify Me" is tapped (button has no visible click-handler/feedback)

### Admin Dashboard
- Good: 4-metric snapshot (Total PGs, Active Complaints, Pending Enquiries, Room Alerts) gives owner instant health check
- Good: ticket cards carry differentiated CTAs (Assign Plumber / Update Status / Assign Staff) based on category — smart contextual action instead of one generic "View" button
- **Gap:** No date-range or PG-property filter on the dashboard — with "6 Total PGs" this will get noisy fast at scale
- **Gap:** "Visitor Leads" call button has no fallback if phone number unavailable (e.g., WhatsApp/chat alternative)

---

## 4. Cross-Screen Consistency Check

| Item | Status |
|---|---|
| Color token reuse | Consistent across all 7 files — single source design tokens |
| Spacing scale reuse | Consistent |
| BottomNav item set | Consistent (Home/PGs/Complaints/Profile) except Admin Dashboard, which swaps "Home" for the same set — fine, expected role difference |
| Icon library | Material Symbols Outlined throughout — consistent, but FILL state usage is inconsistent (some active nav icons filled, others rely only on background pill) |
| CTA button style | Mostly consistent (`bg-primary text-on-primary rounded-lg/xl`) — payment CTA uses `bg-secondary` which is a deliberate/good differentiation for a high-stakes action |
| Empty/loading/error states | **Missing across the board** — no skeleton loaders, no empty-state for zero search results shown live (only a static "can't find" prompt module), no error/toast pattern defined |

---

## 5. Accessibility & Usability Flags
- Chip/toggle buttons rely purely on background-color change for selected state — add a check icon or border-width change for colorblind users (WCAG 1.4.1)
- Several images use `data-alt` instead of `alt` — screen readers will not pick these up; needs to be corrected to standard `alt` attribute
- Curfew/error chips use red-on-red-tint combos (`#ffdad6` / `#93000a`) — verify contrast ratio meets 4.5:1 (borderline, should be tested)
- Tap targets on mobile bottom-nav and chip rows are close to the 44px minimum but not verified — audit before ship

## 6. Recommended Next Steps
1. Define dark-mode token pairs since `darkMode:"class"` is already scaffolded
2. Design missing states: loading skeletons, empty search results, form validation errors, payment success/failure
3. Add a "My Tickets" / tenant dashboard so ticket tracking doesn't depend on manually saved IDs
4. Replace simulated QR/payment with real gateway integration plan (Razorpay/UPI intent) — flag as a build (not just design) task
5. Fix `data-alt` → `alt` across all `<img>` tags for accessibility compliance
6. Add explicit success/feedback micro-states for Room Alerts subscribe action
