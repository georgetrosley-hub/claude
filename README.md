# Claude Seller OS

A prototype of an agentic seller workspace for Anthropic reps: one place to understand the account, decide the next best move, execute with human-approved agent help, and expand Claude across the customer footprint.

## What this is

The app is now organized around the daily jobs a seller actually needs:

- **My Book** — prioritized seller queue, next best action, and upcoming meetings
- **Account OS** — account plan, stakeholder graph, connected systems, and competitive context
- **Deal Room** — land motion, blockers, milestones, and mutual action plan
- **Exec Prep** — narrative, objections, meeting prep, and follow-up draft
- **Expansion Engine** — whitespace motions, sponsor paths, and org map
- **Agent Actions** — grounded actions, source evidence, approvals, and audit trail
- **Manager View** — forecast, inspection, coaching, and workflow health

Nine specialized agents still power the workspace in the background: Territory Intelligence, Research, Competitive Strategy, Technical Architecture, Security & Compliance, Legal & Procurement, Executive Narrative, Expansion Strategy, and Human Oversight.

## Current state

This is still a **front-end prototype**. It does not yet connect to live systems, but it now models a richer seller workspace rather than a pure event simulation.

The thesis is unchanged:

- Claude should detect signals from CRM, calls, docs, and product usage
- Claude should maintain live account memory and whitespace understanding
- Claude should recommend high-leverage seller actions
- Claude should execute only with clear evidence and human approval when needed

## Next product steps

1. **Connect live systems** — Salesforce first, then call intelligence, docs, collaboration, and usage signals.
2. **Add a real agent runtime** — Claude-generated actions with tool use, evidence, memory, and traceable reasoning.
3. **Deepen governance** — approvals, policy checks, audit history, and safe execution into CRM/email/task systems.
4. **Expand to team workflows** — manager inspection, multi-role collaboration, and post-land expansion operations.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Switch accounts from the header to see account-specific plans, opportunities, approvals, and expansion motions.

## Tech stack

Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts. Client-side only.

---

Built by George Trosley. If you'd like to explore this further, I'd love to talk.
