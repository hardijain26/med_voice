# 10 — PM Skills & the No-Code Build

Med-Voice is also a demonstration of *how* a product manager can take an idea from problem to deployed product using no-code / AI-assisted tools — and the PM craft applied along the way. This page is written to double as a portfolio narrative for a **no-code-builder PM profile**.

## The build story (what "no-code builder" means here)

Med-Voice was built the modern PM way — **without a traditional engineering team writing the first version:**

- **Frontend & UX** — assembled in **Google AI Studio** (a no-code/low-code AI app builder), producing a working React app from described intent rather than hand-written scaffolding.
- **The intelligence** — **Google Gemini** (a vision-capable AI model) does the hard part: reading the label, simplifying, translating, and structuring the schedule. No custom OCR or ML pipeline to build or train.
- **Voice** — the browser's built-in **text-to-speech**, with a phonetic-transliteration trick so non-English scripts are pronounced correctly.
- **Deployment** — a static build plus one serverless function, deployable on **Vercel** with a single environment variable.

**The PM takeaway:** the moat is not the code. It's *problem selection, prompt design, language quality, safety, and distribution* — all PM-owned. No-code tools collapse the distance between a validated idea and a shippable product, which puts more of the value on judgment than on implementation.

## PM competencies demonstrated

### 1. Problem discovery & framing
Started from a real, evidenced pain (senior medication non-adherence; see [Business Case](./09-business-case.md)) and named concrete users — "Kamala, 72" and her caregiver son — before choosing any feature ([Who It's For](./02-who-its-for.md)). Every feature traces back to a specific fear or friction ([Features & Value](./04-features-and-value.md)).

### 2. Prioritization
A lightweight **RICE-style** lens applied to the roadmap ([Roadmap](./07-roadmap.md)), with safety weighted above everything in a health product:

| Initiative | Reach | Impact | Confidence | Effort | Call |
|---|---|---|---|---|---|
| Confirm-the-reading step | High | High (safety) | High | Low | **Do first** |
| Label the AI fallback clearly | High | High (safety) | High | Low | **Do first** |
| Multi-medicine schedule | Med | High | Med | Med | Next |
| Pharmacy partnership | Med | High (revenue) | Med | High | Next |

*(Values are relative judgments, not precise scores — the point is a defensible order, not false math.)*

### 3. Metrics & outcome thinking
A metrics tree from activation → comprehension → adherence, with a single **north-star metric** ("weekly correctly-guided doses acted on") that combines reach, quality, and outcome ([Success Metrics](./05-success-metrics.md)). Vanity metrics are explicitly rejected; measurement is restrained because the data is health-sensitive.

### 4. Risk & ethics management
Honest limitations documented, each with a mitigation ([Limitations & Risks](./06-limitations-and-risks.md)). A real risk was caught *in the product's own behaviour* — the offline fallback returned a generic sample that could be mistaken for a real reading — and turned into a fix (`is_fallback` flag) and a roadmap item. Scope is deliberately bounded: **explain an existing prescription, never diagnose or advise.**

### 5. Technical fluency (enough to make good calls)
Understood the architecture well enough to spot that the AI endpoint only ran in local dev and would break in production, and to specify the fix (port it to a serverless function). A PM doesn't need to write it — but naming the problem and the shape of the solution is the job.

### 6. Communication for different audiences
The same product is documented for non-technical readers, for PMs/business stakeholders, and as a shareable visual page — each pitched at the right altitude ([docs index](./README.md)).

## The operating framework behind the work

This project was run with a four-pillar AI-collaboration framework — useful for any PM building with AI/no-code tools:

| Pillar | What it means in practice | Example on Med-Voice |
|---|---|---|
| **Delegation** | Give the AI/tool the parts it does best | Gemini reads and translates; the browser speaks; the PM decides *what* and *why* |
| **Description** | Specify intent precisely — the quality of output tracks the quality of the brief | The Gemini prompt spells out tone ("warm, caring"), structure (JSON schema), and the phonetic requirement |
| **Discernment** | Judge the output critically before trusting it | Caught the dev-only API and the misleading fallback; treats extraction accuracy as a safety metric |
| **Feedback** | Close the loop — capture what worked and what to change | This documentation set, and the "capture learnings after every project" habit, are that loop |

## What a hiring manager or stakeholder should take from this

- **Ships, doesn't just spec.** A real, deployed product — not a slide.
- **Business-literate.** Frames the problem in cost, market, and revenue terms, and picks a go-to-market that matches where the money and the users actually are.
- **Safety-minded.** In a health context, prioritizes the boring, critical safeguards over flashy features.
- **Tool-fluent.** Uses no-code/AI builders to move fast, while keeping human judgment on the parts that matter.

---
*This page describes the product-management approach and build method behind Med-Voice; the business evidence it references is in [09 — Business Case](./09-business-case.md).*
