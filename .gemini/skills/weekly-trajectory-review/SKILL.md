---
name: weekly-trajectory-review
description: Executes the weekly strategic review for HelloShiva by querying Google Search Console and GA4 telemetry, diffing performance against PROJECT_INTENT.md, generating an executive audit report, and updating sprint priorities.
---

# Weekly Trajectory Review Skill

## Purpose
This skill executes the closed-loop growth review for **HelloShiva**. It bridges live production telemetry from Google Search Console (GSC) and Google Analytics 4 (GA4) with the strategic objectives declared in `PROJECT_INTENT.md`.

Use this skill whenever:
1. The scheduled recurring Monday morning review fires.
2. The developer explicitly prompts: *"Run weekly review"*, *"Check project trajectory"*, or *"Review performance against PROJECT_INTENT.md"*.

---

## Execution Workflow

### Step 1: Run the Review Engine
Execute the review script in the project root:
```bash
python scripts/weekly_review_engine.py
```
This script will:
- Connect securely using `.secrets/sa_gsc.json` and `.secrets/sa_ga4.json`.
- Ingest search query positions, impressions, and crawl coverage from GSC.
- Ingest visitor sessions, engagement rate, dwell times, and conversion events (`form_start`) from GA4.
- Generate a timestamped report in `reports/weekly/YYYY-Wxx-trajectory-review.md`.

### Step 2: Read and Evaluate the Generated Report
Read the newly generated report in `reports/weekly/`:
- Check the delta between actual numbers and the active sprint Key Results (KRs) in `PROJECT_INTENT.md`.
- Identify newly discovered opportunities (e.g. keywords in positions 11–25, high dwell-time service pages).
- Identify bottlenecks (e.g. form abandonment, mobile bounce rate spikes).

### Step 3: Present Executive Review to Developer
Summarize the findings concisely for the developer using this format:
1. **Weekly Telemetry Scorecard:** Impressions, clicks, brand position, GA4 active users, engagement rate, and conversions.
2. **OKR Progress Evaluation:** Which KRs were hit, which are in progress, and which slipped.
3. **Proposed Sprint Priorities for Coming Week:** Propose 2–3 high-leverage actions.
4. **Human-in-the-Loop Confirmation:** Ask the developer if they approve the updated sprint priorities before updating `PROJECT_INTENT.md`.

### Step 4: Update `PROJECT_INTENT.md`
Upon developer confirmation:
- Update the **Active Sprint Objectives & Key Results (OKRs)** section in `PROJECT_INTENT.md`.
- Add an entry into the **Weekly Trajectory Review Log** with the current ISO week, date, and executive outcome.
