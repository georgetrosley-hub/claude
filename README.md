# Snowflake GTM Command Center

Internal GTM hub for Snowflake Account Executives. This territory is heavy on **existing customers** — the job is to **land net-new logos** and **aggressively expand consumption and use cases** for Snowflake within these accounts. This project provides a single place for platform narrative, deal playbooks, field kit, and war room tools.

## What’s inside

- **Platform Overview** — AI Data Cloud pillars, key metrics, and strategic message
- **Why Snowflake, Why Now** — Strategic transition, timeline highlights, buyer expansion
- **War Room** — Account-centric view (accounts N/A until configured)
- **Account Intelligence, Pipeline, Deal Playbook, Deal Progression, Account Log**
- **Stakeholder Map, Deal Plan**
- **First 90 Days, Deal Signals, Field Kit**
- **Use Case Library, ROI Calculator, Territory Engine**
- **Platform vs Alternatives** — Snowflake vs Databricks, BigQuery, Redshift

Content is aligned with Snowflake’s position as the **governed operating system for enterprise AI**: Cortex, Snowflake Intelligence, Cortex Code, MCP, Snowflake Postgres, Horizon, and Observe.

## Accounts

Accounts are **N/A** for now. When you’re ready, add account data in `data/accounts.ts` and set the default in `data/accounts.ts` (`defaultAccountId`).

## Environment variables

Optional — for chat and AI-generated content:

- **ANTHROPIC_API_KEY** — Your API key (or add via the API Key button in the app)
- **GOOGLE_API_KEY** — Enables Google Sheets read endpoint
- **SLACK_WEBHOOK_URL** — Enables Slack post endpoint
- **SF_INSTANCE_URL** + **SF_ACCESS_TOKEN** — Enables Salesforce SOQL query endpoint
- **GOOGLE_OAUTH_CLIENT_ID** + **GOOGLE_OAUTH_CLIENT_SECRET** — Reserved for Calendar/Gmail/Docs/Slides OAuth connectors

## Integrations (MVP)

This build includes connector-ready API routes:

- `GET /api/integrations/status` — Integration configuration status
- `POST /api/integrations/google/sheets` — Read values from Google Sheets (`spreadsheetId`, `range`)
- `POST /api/integrations/slack/post` — Post a Slack message (`text`)
- `POST /api/integrations/salesforce/query` — Run a SOQL query (`soql`)

Example requests:

```bash
curl -X POST http://localhost:3000/api/integrations/google/sheets \
  -H "Content-Type: application/json" \
  -d '{"spreadsheetId":"<SHEET_ID>","range":"Sheet1!A1:G200"}'

curl -X POST http://localhost:3000/api/integrations/slack/post \
  -H "Content-Type: application/json" \
  -d '{"text":"POV approved for U.S. Financial Technology"}'

curl -X POST http://localhost:3000/api/integrations/salesforce/query \
  -H "Content-Type: application/json" \
  -d '{"soql":"SELECT Id, Name FROM Account LIMIT 10"}'
```

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts. Optional Claude API for chat and generation. Client-side state; prototype-grade.

## Deploy & push to GitHub

Repo: **https://github.com/georgetrosley-hub/snowflake**

```bash
git remote add origin https://github.com/georgetrosley-hub/snowflake.git
# or, if origin exists: git remote set-url origin https://github.com/georgetrosley-hub/snowflake.git
git add -A
git commit -m "Rebrand to Snowflake GTM Command Center for internal AEs"
git push -u origin main
```

(Use `master` if your default branch is `master`.)

---

Built for Snowflake internal GTM. Platform narrative and section ideas informed by the Snowflake research pack and snowflake.com.
