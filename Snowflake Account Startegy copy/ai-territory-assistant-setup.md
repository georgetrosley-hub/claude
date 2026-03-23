# AI Territory Assistant — Setup Guide

Use this guide to create a Custom GPT (ChatGPT) or Claude Project that knows your three accounts and your strategy. When you prep for a call or need an outreach angle, it will be grounded in your actual hypotheses—not generic sales copy.

---

## Option A: Custom GPT (ChatGPT Plus)

### Step 1: Create the GPT

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click your profile → **My GPTs** → **Create a GPT**
3. Switch to **Configure** tab

### Step 2: Basic Info

- **Name:** Snowflake Territory Assistant
- **Description:** AI assistant for Snowflake EAE territory (Ciena, Sagent, US FinTech). Suggests outreach, prep, and next actions grounded in account strategy.
- **Instructions:** Paste the following:

```
You are my Snowflake Enterprise Account Executive territory assistant for three accounts: Ciena, Sagent, and U.S. Financial Technology.

Your role:
- Suggest outreach angles, discovery questions, and next actions based on my account strategy
- Help me prep for calls by validating or challenging my hypotheses
- Draft emails that reference specific workloads and recent account signals
- Never use generic sales language—everything must tie to the specific first workloads and proof points I've defined

When I ask about an account, use this strategy:

**Ciena** (P1)
- Hypothesis: "Ciena's risk is not demand. It's execution against that demand."
- First workload: Backlog risk + margin visibility on AI deals
- Proof point: Show backlog risk on 2-3 AI deals within 24 hours
- Key stakeholders: CFO/FP&A, supply chain, sales ops
- Compelling events: AI demand 30%+ YoY, new CFO, raised guidance

**Sagent** (P2)
- Hypothesis: "Sagent's risk is not building Dara. It's proving it works across customers."
- First workload: Deployment performance view across Dara customers
- Proof point: Identify 1-2 underperforming Dara deployments
- Key stakeholders: Product/engineering, Customer Success
- Compelling events: Dara at-scale rollouts, new CEO/President, board wants measurable outcomes

**U.S. Financial Technology** (P3)
- Hypothesis: "They've solved data access. They haven't solved decision speed."
- First workload: Securitization exception + anomaly monitoring
- Proof point: Surface real-time anomaly vs delayed reporting
- Key stakeholders: Data platform leadership, securitization ops
- Compelling events: Pivot to external platform, mortgage rates above 6%, value from speed

Snowflake differentiators to emphasize in regulated contexts: operational layer on governed data, no new pipelines, extends what they already trust.
```

### Step 3: Upload Knowledge

1. Click **Knowledge** → **Upload files**
2. Upload: `FINAL _ SNOWFLAKE QBR _ CIENA, SAGENT & US FINTECH.pptx.pdf` (your deck)
3. Optional: Upload this setup doc or a 1-page strategy summary

### Step 4: Capabilities

- Enable **Web Browsing** (for current news on accounts)
- Enable **Code Interpreter** (optional, for data analysis)

### Step 5: Save and Share

- Save as **Only me** (for interview prep) or **Anyone with link** (if you want to demo it)

---

## Option B: Claude Project (Claude.ai)

### Step 1: Create a Project

1. Go to [claude.ai](https://claude.ai)
2. Click **Projects** in the sidebar → **Create Project**
3. Name it: **Snowflake Territory — Ciena, Sagent, US FinTech**

### Step 2: Add Project Knowledge

1. Click **Add to project** (paperclip icon)
2. Upload: `FINAL _ SNOWFLAKE QBR _ CIENA, SAGENT & US FINTECH.pptx.pdf`
3. Add a note or create `strategy-context.md` with the same account summaries from the GPT instructions above

### Step 3: Use Persistent Context

When starting a new chat in the project, Claude will have access to:
- Your full deck
- Your hypotheses, first workloads, proof points

**Example prompts to try:**
- "What should I do for Ciena this week?"
- "Summarize Sagent's situation for my deployment risk pitch"
- "Draft an email to the data platform lead at US FinTech about anomaly detection"
- "Generate 5 discovery questions to validate my Ciena hypothesis"

---

## Demo Script for Your Presentation

When presenting to the hiring manager:

1. **Set up:** "I've built an AI assistant trained on this exact account strategy."
2. **Show:** Open the Custom GPT or Claude Project. Ask: *"What should I do for Ciena this week?"*
3. **Explain:** "Notice the response ties to backlog risk, the CFO org, and the 24-hour proof point—not generic 'schedule a meeting' advice. That's because the assistant knows my hypotheses."
4. **Close:** "This is how I'd run outreach at scale—personalized, specific, and grounded in what I've already validated."

---

## Tips

- **Refresh knowledge** when you land the role and get real consumption/CRM data
- **Add recent news** manually or via web search before key outreach
- **Use for post-call** — paste meeting notes and ask: "Extract confirmed pain, objections, next steps"
