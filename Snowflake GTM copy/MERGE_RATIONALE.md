# Merge Rationale: Territory Operating System

## What We Kept from Each App

### From App A (Snowflake GTM — React/Tailwind shell)
- **Visual foundation**: Sidebar, StatusBar, ChatPanel, design system (globals.css, Snowflake blue accent)
- **Layout & navigation**: Scrollspy, section-based navigation, mobile drawer, collapsible sidebar
- **Account switcher**: Header account dropdown, context for selected account
- **Infrastructure**: Next.js, Tailwind, theme toggle, API key for chat
- **Component patterns**: SectionHeader, compact card layouts, consistent typography

### From App B (Account Strategy — Vanilla HTML/JS)
- **Operator-ready account format**: hypothesis, firstWorkload, proofPoint, pivotIfNeeded, nextAction
- **Concrete next 7 days**: Day-by-day actions with account tags
- **Activity feed**: Log outreach, meetings, milestones with add form
- **Signal tracker**: Curated news with add form, localStorage persistence
- **Punchy account framing**: "Ciena's risk is not demand. It's execution against that demand."

---

## What We Removed

### From App A
- **Dense narrative blocks**: Long stakeholder strategy lists, verbose "How Accounts Expand" copy
- **7-tab Account Dossier**: Business Overview, Financial Snapshot, 10-K, Cloud & AI, Competitive, Snowflake POV, Action Plan — collapsed into compact sections
- **24h/7d/30d/12m briefing matrix**: Per-account time-window briefing — simplified to single briefing with 24h/7d/30d toggle
- **Execution Framework** as standalone section: Folded into Discovery Prep + POV Plan
- **Territory Priorities** duplicate content: Merged with Priority Accounts
- **"My Snowflake Operating Model"** 3-step section: Reduced to Expansion Path sequence

### From App B
- **Cortex AI sidebar**: Claude API strategy panel — retained as ChatPanel "Ask" in App A shell
- **Consumption Snapshot**: Placeholder cards — omitted (connect post-onboarding)
- **Theme toggle in nav**: Moved to StatusBar (already in App A)
- **Vanilla HTML/JS implementation**: Migrated to React components

---

## Why the Final Structure Is Stronger

### 1. **Single source of truth per account**
Each account page now answers exactly 5 questions in compact form:
- Why this account matters
- Best expansion wedge
- What to confirm first
- POV hypothesis
- Recommended next action

No more scrolling through long paragraphs to find the next move.

### 2. **Reduced text volume (~35%)**
- Long narrative blocks replaced with bullet-style operator-ready sections
- Discovery angles and talk tracks in scannable lists
- POV Plan limited to hypothesis + Snowflake vs Databricks
- Expansion Path as 4-step visual sequence

### 3. **Screen-share optimized**
- Sidebar nav for quick jumps during interview demos
- Large, readable section headers
- Compact cards that fit on one screen
- Activity/Signals add forms for live demonstration

### 4. **Action-first information architecture**
New IA order:
1. **Overview** — One sentence, one screen
2. **Priority Accounts** — 5-question cards + detail view
3. **Account Brief** — Signal-driven next actions (24h/7d/30d)
4. **Discovery Prep** — Angles and talk tracks
5. **POV Plan** — Hypothesis and competitive framing
6. **Expansion Path** — Land → prove → expand
7. **Weekly Briefing** — 7-day operating priorities
8. **Signals & Activity** — Feed + tracker with add

Each section answers "what do I do with this?" rather than "what is this?"

### 5. **Unified data model**
- One `territory-data.ts` with priority accounts, next 7 days, activities, signals
- `TerritoryDataProvider` for add/persist of activities and signals
- Account ids aligned across data/accounts.ts and territory-data.ts

---

## File Changes Summary

| File | Change |
|------|--------|
| `data/territory-data.ts` | **New** — Merged account format, next7Days, activities, signals |
| `app/context/territory-data-context.tsx` | **New** — Activities/signals state + add + localStorage |
| `components/sections/overview.tsx` | **Replaced** — 8 compact sections, 35% less text |
| `components/layout/sidebar.tsx` | **Updated** — 8 nav items for new IA |
| `app/page.tsx` | **Updated** — New ORDERED_SECTIONS, simplified Overview props |
| `app/layout.tsx` | **Updated** — TerritoryDataProvider added |
