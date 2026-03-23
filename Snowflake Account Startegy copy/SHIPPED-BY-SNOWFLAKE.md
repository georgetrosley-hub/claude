# Making This Look Shipped by Snowflake

Changes already applied and additional recommendations.

## Implemented

- **Footer** — © 2025 Snowflake Inc. All Rights Reserved, links to snowflake.com and brand guidelines
- **Logo** — Snowflake wordmark with ®, links to snowflake.com (per [brand guidelines](https://www.snowflake.com/brand-guidelines/))
- **Favicon** — Snowflake-blue SVG favicon in browser tab
- **Buttons** — Pill-shaped (80px radius), 34px height, all caps — matches Snowflake UI element specs
- **Typography** — Lato 900 for headlines, Lato 400/700 for body
- **Brand colors** — Snowflake Blue (#29B5E8), Star Blue, Valencia Orange, Windy City from official palette
- **Meta description** — For sharing and SEO

## Additional Recommendations

### 1. Use the Official Snowflake Logo

Download the logo package from [snowflake.com/brand-guidelines](https://www.snowflake.com/brand-guidelines/) (LOGOS section). Replace the custom SVG in the header with the official Snowflake Blue logo. The bug must be used with the registration mark (®).

### 2. Texta Font for Headlines (If Available)

Snowflake uses **Texta** for headlines in their brand materials. It may be a licensed/proprietary font. If you have access via Snowflake assets, use Texta Heavy for the hero title and section titles. Otherwise, Lato 900 is a close approximation.

### 3. Left Sidebar Navigation (Snowsight-Style)

Snowflake’s Snowsight UI uses a collapsible left nav. Adding a simple sidebar with sections (Territory, Accounts, Briefing, etc.) would make it feel more like a product.

### 4. Search Bar

Snowsight includes a prominent search bar. A “Search accounts, signals…” placeholder in the header would add a product-like touch.

### 5. Status / Sync Indicator

The reference site has “In sync” and “Needs attention” states. Wiring these to real data (or mock states) would make the status badge feel functional.

### 6. Empty States

If Activity Feed or Signal Tracker are empty, show a short message and CTA instead of a blank area.

### 7. Loading States

Skeleton loaders or spinners for sections that could load asynchronously would make it feel more like a real app.

### 8. Accessibility

- Add `aria-label` to icon-only controls
- Ensure focus styles meet WCAG contrast
- Add skip-to-content link

### 9. Dark/Light Theme Toggle

Snowsight supports themes. A toggle would align with the product experience, though the dark theme fits the current design.

### 10. App-Like Layout

Consider a fixed header and scrollable main content so the nav and header stay visible on long pages.
