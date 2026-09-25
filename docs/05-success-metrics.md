# 05 — Success Metrics

A product for seniors succeeds only if it changes real behavior: people understand their medicine and take it correctly. These are the metrics a product manager should watch, grouped from "did they even get value once?" to "did it change their life?"

> **Note:** These are the *right things to measure*. Some require adding lightweight, privacy-respecting analytics that don't exist in the current build yet — treat this as the measurement plan.

## 1. Activation — did the user get value the first time?

| Metric | What it tells you | Healthy signal |
|---|---|---|
| **Successful first scan rate** | Of people who open the app and try, how many get a usable result? | High — most first attempts should succeed. |
| **Time to first spoken instruction** | How long from opening the app to hearing guidance? | Seconds, not minutes. |
| **Scan success rate** | Of all photos taken, how many produce a confident result (vs. fallback)? | High and rising as capture guidance improves. |

## 2. Comprehension — did they actually understand?

| Metric | What it tells you | How to capture it |
|---|---|---|
| **Replay rate** | How often users replay the audio. Occasional replay = helpful; constant replay = confusing. | Count audio replays per session. |
| **Language switch rate** | Are users switching away from the default because it's wrong for them? | Track language changes. |
| **Optional "Did this make sense?" thumbs up/down** | Direct comprehension feedback. | A one-tap prompt after playback. |

## 3. Adherence — did it change behavior? *(the north star)*

| Metric | What it tells you | Notes |
|---|---|---|
| **Reminder set rate** | Of users who scan, how many set voice reminders? | Setting a reminder is the intent to comply. |
| **Reminder acknowledgment rate** | Of reminders fired, how many are marked "taken"? | The closest proxy for real adherence. |
| **Repeat usage / return rate** | Do users come back for their next medicine or refill? | Sustained use is the strongest value signal. |

## 4. Trust & reliability — is the experience dependable?

| Metric | What it tells you | Target |
|---|---|---|
| **Fallback rate** | How often the app serves safe-default guidance because the AI was unavailable. | As low as possible; spikes signal a supply problem. |
| **Error / dead-end rate** | How often a user hits something that isn't usable help. | Near zero. |
| **Extraction accuracy** | Spot-checked correctness of medicine name, dose, and timing. | Very high — this is a safety metric, not a vanity one. |

## The one number to rally around

If you had to pick a single north-star metric, use:

> **Weekly count of correctly-guided doses acted on** — i.e. doses where the user received accurate instructions *and* acknowledged taking the medicine.

It combines reach (how many people), quality (accurate guidance), and outcome (they acted). Every feature should be able to answer: *does this move that number?*

## A caution on measurement

This is a health-adjacent product for a vulnerable group. Measure with restraint:
- Collect the **minimum** needed to improve the product.
- Prefer **aggregate** counts over anything that identifies an individual.
- Never treat medication data casually. Trust is the product.
