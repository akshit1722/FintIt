# CLAUDE.md — Project Context & Developer Guide

## Project Overview
- **Name:** FindIt – Lost & Found Campus Platform
- **Tagline:** *"Lost Something? Find It. Found Something? Return It."*
- **Domain:** College-level academic web application for students, faculty, and security staff to report, browse, search, and claim lost and found campus belongings.
- **Repository Location:** `c:\Users\Akshit\Documents\FindIt\`

---

## Strict Technology & Architectural Rules
When generating, modifying, or reviewing code for this project, you **MUST** adhere to the following constraints:
1. **Strictly Pure Frontend:** Native HTML5, CSS3, and Vanilla JavaScript (ES6+).
2. **No Frontend Frameworks:** Absolutely NO React, Vue, Angular, Svelte, etc.
3. **No CSS Frameworks:** Absolutely NO Tailwind CSS, Bootstrap, Bulma, Foundation, etc. All styling must be written in custom, modular CSS.
4. **No Helper Libraries:** NO jQuery, Lodash, Axios, etc. Use native browser APIs (`querySelector`, `fetch`, `addEventListener`, `URLSearchParams`, `FileReader`, `localStorage`).
5. **No Backend or Database Engines:** NO Node.js, Express, Python, PHP, Firebase, Supabase, MySQL, or MongoDB.
6. **Zero Build Step:** The website runs directly by opening `.html` files in any modern web browser.
7. **Fixed Light Theme Only:** Strict professional light palette. **NO dark mode**, NO theme switcher button, NO dark-mode media queries.

---

## Directory & File Structure
```text
FindIt/
├── index.html                   # Landing page (hero visual, 3-step guide, recent items, benefits, CTA)
├── dashboard.html               # Main search & multi-facet filtering dashboard (14+ items)
├── report.html                  # Dual reporting portal (Lost vs. Found) with live image preview
├── item-details.html            # Dynamic single-item view with custody trail & claim modal
├── closed-reports.html          # Public recovery archive & security verification timeline
├── contact.html                 # Campus security desks, drop-off stations, FAQ, and contact form
├── README.md                    # Project requirements and overview
├── PROJECT_DOCUMENTATION.md     # Full academic technical report & viva preparation guide
├── CLAUDE.md                    # Context & developer guidelines for Claude (this file)
├── css/
│   ├── style.css                # Base resets, 8-pt spacing, typography tokens, buttons, cards, badges
│   ├── landing.css              # Hero visual composition, process cards, recent item cards
│   ├── dashboard.css            # Search bar, KPI counters, glassmorphic filter toolbar, empty states
│   ├── forms.css                # Report type switcher cards, drag-and-drop zone, image preview, modals
│   ├── item-details.css         # Split 2-column layout, image frame, timeline steps, claim box
│   └── responsive.css           # Breakpoints (1440px, 1024px, 768px, 375px), touch targets, mobile drawer
├── js/
│   ├── main.js                  # Mobile navigation drawer, backdrop overlay, escape key, active links
│   ├── dashboard.js             # Centralized master dataset (DEMO_ITEMS), compound filtering, localStorage merge
│   ├── forms.js                 # Report toggle, FileReader image preview, localStorage submission modal
│   └── item-details.js          # URL query parsing (?id=ITEMxxx), claim modal, not-found fallback
└── assets/
    ├── icons/                   # High-contrast navigation and category icons (PNG/SVG)
    └── images/
        ├── banners/             # Campus hero photography
        ├── illustrations/       # Visual accents, dot patterns, blue gradients, wave banners
        └── items/               # 14 distinct item photos (backpack, earbuds, student-id, etc.)
```

---

## Design System Tokens (`css/style.css`)
Use these exact CSS custom properties across all styles:
```css
:root {
  /* Brand Tokens */
  --primary: #2563EB;          /* Royal Blue: Primary action, focus states */
  --primary-dark: #1D4ED8;     /* Deep Navy-Blue: Hover states */
  --primary-light: #EFF6FF;    /* Ice Blue: Active pill backgrounds */
  --primary-subtle: rgba(37, 99, 235, 0.08);
  --primary-border: #BFDBFE;

  /* Canvas Tokens (Fixed Light Theme) */
  --background: #F8FAFC;       /* Off-White / Slate 50: Non-glare canvas */
  --surface: #FFFFFF;          /* Pure White: Cards, modals, containers */
  --surface-soft: #F1F5F9;     /* Light Gray: Secondary inputs, soft backgrounds */
  --surface-alt: #E2E8F0;

  /* Typography Tokens */
  --navy: #0F172A;             /* Slate 900: High-contrast headings */
  --navy-light: #1E293B;
  --text-primary: #1E293B;     /* Slate 800: High-readability body copy */
  --text-secondary: #64748B;   /* Slate 500: Subtitles, metadata, timestamps */
  --text-muted: #94A3B8;

  /* Semantic Status Badges */
  --danger: #DC2626;           /* Crimson: 'Missing' status */
  --danger-light: #FEF2F2;
  --danger-border: #FECACA;

  --success: #16A34A;          /* Emerald: 'Found' status */
  --success-light: #F0FDF4;
  --success-border: #BBF7D0;

  --warning: #F59E0B;          /* Amber: In-review / pending */
  --warning-light: #FFFBEB;

  --info: #0284C7;             /* Sky Blue: Informational */
  --info-light: #F0F9FF;

  --border: #E2E8F0;           /* Crisp component perimeter lines */

  /* 8-Point Spatial Grid */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.07);
  --shadow-glass: 0 8px 32px 0 rgba(15, 23, 42, 0.06);
}
```

---

## Page-by-Page Specifications & User Flows

1. **`index.html` (Landing Page):**
   - Sticky navbar with brand logo, nav links (`Home`, `Locate It`, `Report It`, `Closed Reports`, `Contact Us`), and `Dashboard` button.
   - Hero section with headline: *"Lost Something? Find It. Found Something? Return It."*
   - Interactive hero visual composition of campus items with floating glassmorphic badges.
   - "How FindIt Works" (3 steps: *Report*, *Discover*, *Reconnect*).
   - "Recently Reported Items" (6 cards linking to `item-details.html?id=ITEM001` through `ITEM006`).
   - 4 Trust Pillars (Campus Security custody, verified ownership, privacy, departmental tracking).
   - Pre-footer CTA banner and campus footer.

2. **`dashboard.html` (Main Item Feed):**
   - 4 Metric KPI summary cards (Total Reports, Missing Items, Found Items, Recovered Items).
   - Real-time search bar (by name, category, location, or description).
   - Filter toolbar:
     - Status pills: *All Items*, *Missing*, *Found*.
     - Category select: *Electronics*, *ID Cards & Wallets*, *Bags*, *Books & Stationery*, *Keys*, *Clothing*, *Personal Accessories*.
     - Campus location select: *Central Library*, *Academic Block*, *Cafeteria*, *Sports Complex*, *Labs*, *Hostels*.
     - Date sorting select: *Newest First*, *Oldest First*.
   - Separated feeds: Missing Items Grid & Found Items Grid.
   - Interactive empty state card (`#emptyState`) with a "Clear All Filters" button when no results match.

3. **`report.html` (Reporting Portal):**
   - Segmented 2-card radio choice: *Report a Missing Item* vs. *Report a Found Item*.
   - Required fields: Item Name, Category, Campus Location, Date Lost/Found, Item Colour, Description.
   - Optional fields: Distinguishing Features, Contact Email.
   - File input with instant client-side image preview using HTML5 `FileReader` (Base64 data URL).
   - Submitting prevents default form submission, creates a new record object with ID `ITEM-CUSTOM-xxx`, prepends it to `localStorage['findit_custom_reports']`, and opens a confirmation modal.

4. **`item-details.html` (Dynamic Item Resolver):**
   - Reads item ID from URL query parameters (`window.location.search`, e.g., `item-details.html?id=ITEM001`).
   - Normalizes numeric IDs: `?id=1` or `?id=ITEM1` auto-resolves to `ITEM001`.
   - Merges static `DEMO_ITEMS` with `localStorage` reports via `getAllItems()`.
   - Fallback view: Displays *"Item not found."* card with a button back to dashboard if ID is invalid.
   - Found item view: Shows verified custody steps and renders the "Claim This Item" form (name, email, proof of ownership).
   - Missing item view: Shows *"Have you found this item? Help the owner by reporting it as found."* linking to `report.html`.

5. **`closed-reports.html` (Resolved Archive):**
   - Displays 6 recovered sample records with green "Recovered" badges.
   - Summaries: Total Closed Reports and Average Recovery Time.
   - Privacy-preserving: Hides private claimant details, showing only item details and return custody station.

6. **`contact.html` (Security Directory & FAQ):**
   - Physical campus security desks (Main Gate, Academic Block, Sports Complex) with operational hours and phone extensions.
   - Drop-off station procedures.
   - Interactive FAQ accordion for common lost-and-found policies.
   - Direct inquiry form with submission confirmation dialog.

---

## JavaScript Data Schema & Shared Engine

### Item Data Model
```typescript
interface CampusItem {
  id: string;               // e.g. "ITEM001", "ITEM-CUSTOM-1732450000"
  name: string;             // e.g. "Black Wireless Earbuds"
  status: 'missing' | 'found' | 'recovered';
  category: 'electronics' | 'id-cards' | 'bags' | 'stationery' | 'accessories' | 'clothing' | 'keys';
  location: string;         // e.g. "Central Library Hall"
  date: string;             // e.g. "Oct 14, 2026"
  description: string;      // Full description
  features?: string;        // Distinguishing markings
  image: string;            // Path like "assets/images/items/earbuds.jpg" or Base64 Data URL
  contact?: string;         // Optional masked contact
}
```

### Shared Engine (`dashboard.js` & `item-details.js`)
- `DEMO_ITEMS`: 14 predefined items covering all categories and locations.
- `getAllItems()`: Helper function that merges `DEMO_ITEMS` with `localStorage.getItem('findit_custom_reports')` so user-created reports appear immediately across the dashboard and detail pages.
- Exposes `window.FindItData = { DEMO_ITEMS, getAllItems };` globally.

---

## Guidelines for Any Future Tasks / Prompts
When working on this project:
1. **Preserve Existing Working Features:** Do not overwrite functional layouts or logic.
2. **Always Link Relative Paths Correctly:** All asset paths are relative to root (`assets/images/items/xyz.jpg`, `css/style.css`, `js/main.js`).
3. **Keep Code Modular:**
   - Global styles go in `css/style.css`.
   - Page-specific styles go in `css/landing.css`, `css/dashboard.css`, `css/forms.css`, or `css/item-details.css`.
   - Media queries go in `css/responsive.css`.
4. **Use Clickable File Links:** When reporting back to the user, reference files using markdown links with file scheme (`file:///c:/Users/Akshit/Documents/FindIt/index.html`).
5. **Maintain Light Theme:** Never introduce dark mode styles or invert background colors.
