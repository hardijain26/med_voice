# 01 — Product Overview

## The problem, in human terms

Imagine your grandmother comes home from the pharmacy with a small bottle. The label says:

> *"Amoxicillin 500mg cap. Take 1 cap PO BID p.c. x7d. Do not exceed prescribed dose."*

To a pharmacist, that's clear. To almost everyone else, it's a puzzle:

- **The print is tiny.** Many seniors can't read it without a magnifying glass.
- **The words are clinical.** "PO BID p.c." means "by mouth, twice a day, after meals" — but nobody says that at the kitchen table.
- **It's often in a language they don't read well.** In multilingual countries, the label is printed in English while the patient thinks in Hindi, Tamil, or Bengali.
- **There's no sense of time.** "Twice daily" doesn't tell you *when*. Is that any two times? With food or without?

The result is predictable and dangerous: **wrong doses, missed doses, double doses, and people quietly giving up on medicines that were supposed to help them.** This isn't a small issue — poor medication adherence is one of the biggest, most preventable drivers of avoidable hospital visits.

## What Med-Voice does

Med-Voice is an **accessible prescription-label simplifier and audio guide**. It takes the intimidating label and turns it into something a senior can actually use:

1. **Reads the label from a photo** — no typing required.
2. **Rewrites the instructions** into short, warm, everyday sentences.
3. **Speaks them aloud** in the user's own language.
4. **Breaks the day into clear moments** — "1 tablet after breakfast at 8 AM," "1 tablet after dinner at 8 PM."
5. **Highlights the one safety warning that matters** — e.g. "Take with food," "Do not drink alcohol."
6. **Sets voice reminders** so no dose is forgotten.

The design goal is dignity: the user shouldn't need reading glasses, a medical dictionary, or a family member on call. They point their phone, and the phone talks to them like a caring helper.

## Why it matters (the value)

| For… | The value Med-Voice delivers |
|---|---|
| **The senior** | Independence and confidence. They can manage their own medicine safely without asking for help each time. |
| **The caregiver / family** | Peace of mind and less daily burden. Fewer "Mom, did you take your pill?" phone calls. |
| **The healthcare system** | Better adherence means fewer complications, fewer avoidable hospital visits, and better outcomes. |
| **The pharmacy / clinic (potential partner)** | A differentiated, caring service they can offer patients without reprinting a single label. |

## What makes it different

- **Voice-first, not text-first.** Most health apps assume you can read a screen. Med-Voice assumes you'd rather *listen*.
- **Truly multilingual.** It doesn't just translate words — it rewrites them into natural, spoken phrasing, and even provides a phonetic version so the voice sounds right in languages the phone's speaker doesn't natively support.
- **Built to keep working.** If the AI is overloaded or offline, Med-Voice still gives the user safe, sensible guidance instead of an error screen (see [Limitations & Risks](./06-limitations-and-risks.md)).

## The boundary of this documentation

This documentation describes the **product and its behavior**, which is fully visible in how the app processes a prescription. The visual screen-by-screen interface code is maintained in the design/build tool (Google AI Studio) rather than in this repository, so screenshots and pixel-level UI walkthroughs are out of scope here. Everything about *what the product does and why* is covered.
