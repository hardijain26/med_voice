# 09 — Business Case

A product manager's view of *why this is worth building* — the problem in business terms, the market, the value, and how it could make money. Where numbers appear, sources are linked; illustrative estimates are labelled as such rather than presented as fact.

## 1. The business problem

Medicine only works if people take it correctly. Most don't.

- The World Health Organization's benchmark finding is that adherence to long-term therapy for chronic illness averages **about 50%** in developed countries — and is lower in low- and middle-income settings. ([WHO / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC3068890/))
- In the United States alone, medication non-adherence drives an estimated **$100 billion in direct costs**, and **up to $300 billion** in total avoidable spending, is linked to **~125,000 deaths a year**, and accounts for **at least 10% of hospitalizations**. ([Duke Health](https://physicians.dukehealth.org/articles/medication-nonadherence-increases-health-costs-hospital-readmissions), [economic review](https://pubmed.ncbi.nlm.nih.gov/29358417/))
- In India — Med-Voice's first target market — only **40–60% of older adults** reach adequate adherence to long-term therapy, with **low health literacy** repeatedly named as a core barrier, alongside rural/urban and gender gaps. ([Frontiers in Pharmacology](https://www.frontiersin.org/journals/pharmacology/articles/10.3389/fphar.2023.1183818/full), [community study, Gujarat](https://pmc.ncbi.nlm.nih.gov/articles/PMC13408220/))

**Reframed as a business problem:** a large, growing population of seniors cannot reliably act on the instructions they're given, because those instructions are unreadable, jargon-filled, or in the wrong language. Every missed or wrong dose pushes cost and risk back into the health system — and represents a customer whose core need is unmet.

### Root causes (what we'd actually fix)

| Root cause | Consequence | Med-Voice's lever |
|---|---|---|
| Tiny, clinical label text | Can't read or decode it | Reads it aloud in plain words |
| Language mismatch | Instructions in a language they don't read | 11-language spoken output |
| No sense of timing | "Twice daily" → guesswork | Meal-based schedule + reminders |
| Low digital literacy | Won't use complex apps | Three-tap, voice-first design |

## 2. Market & opportunity

**Who has this problem:** seniors on one or more long-term medicines, plus the family members who worry about them. India is the beachhead — a very large elderly population, high linguistic diversity, and documented adherence and literacy gaps — with the same problem present across multilingual, aging populations globally.

**Illustrative market sizing** *(method shown; inputs must be validated before any planning use — these are not researched market figures):*

- **TAM** — seniors on chronic medication in multilingual markets worldwide.
- **SAM** — smartphone-reachable seniors + caregivers in India and comparable markets.
- **SOM (first 2 years)** — reachable through 2–3 concrete channels: pharmacy chains, hospital discharge desks, and caregiver-led installs.

> **PM note:** I'm deliberately *not* inventing a dollar TAM here. The credible next step is a bottom-up estimate from real inputs (population on chronic meds × smartphone penetration × willingness-to-pay by channel). Presenting a fabricated number would fail the first test of a business case — that its inputs survive scrutiny.

## 3. The solution & value proposition

**One line:** point a phone at a prescription label and hear exactly what to take, how much, and when — in your own language.

**Value by stakeholder:**

| Stakeholder | Job-to-be-done | Value delivered | Willingness to pay |
|---|---|---|---|
| Senior patient | "Take my medicine correctly, on my own" | Independence, safety, dignity | Low (indirect payer) |
| Caregiver / family | "Know Mom is guided right when I'm not there" | Peace of mind, less daily load | **Medium–High** |
| Pharmacy / clinic | "Differentiate and improve outcomes" | A caring service, better adherence, loyalty | **High (B2B)** |
| Health system / insurer | "Cut avoidable admissions" | Fewer complications and readmissions | High (outcome-based) |

The pattern to notice: **the person with the problem is usually not the person who pays.** That shapes the business model.

## 4. Business model options

| Model | How it works | Pros | Cons | Best when |
|---|---|---|---|---|
| **B2C freemium** | Free scan + audio; paid reminders/multi-med | Direct reach, fast learning | Seniors are price-sensitive; low direct WTP | Building early traction & data |
| **B2B2C (pharmacy/clinic)** | Partner offers Med-Voice to patients; partner pays | High WTP, built-in distribution, trust | Longer sales cycle | **Recommended primary path** |
| **Payer / outcome-based** | Insurer pays for measurable adherence lift | Aligns to real value ($ saved) | Needs proof of adherence impact | After outcome data exists |
| **API / white-label** | License the simplify-and-speak engine | Scalable, low support | Commoditization risk | Once the core is a moat |

**Recommendation:** lead with **B2B2C via pharmacies and discharge desks** (high willingness to pay + distribution to exactly the right users), while a free consumer tier generates usage data and the adherence evidence needed to later approach payers. The existing partner **webhook hand-off** in the product is an early hook for this path.

## 5. Competitive landscape

| Alternative | What they do | Gap Med-Voice fills |
|---|---|---|
| Generic pill-reminder apps | Alarms for doses you enter manually | They assume you can already *read and understand* the label; Med-Voice removes that assumption |
| Pharmacist counselling | Verbal explanation at pickup | Not available at 8 PM at home, in the patient's language, on demand |
| Large-print / translated labels | Static reprint | No audio, no timing logic, no reminders, limited languages |
| General AI assistants | Can answer questions | Not senior-safe, not voice-first, not purpose-built for a label |

**Where Med-Voice wins:** it is the only option that goes *from a photo of the real label to spoken, scheduled, native-language guidance* with no reading and no typing. The defensibility over time comes from language/phrasing quality, safety track record, and partner distribution — not the AI model itself, which is a commodity input.

## 6. Go-to-market (first 6–12 months)

1. **Beachhead:** one metro, 2–3 languages, via a single pharmacy-chain pilot.
2. **Wedge:** the discharge/pickup moment — the point of maximum anxiety and clearest need.
3. **Proof:** measure adherence lift and comprehension against a control (see [Success Metrics](./05-success-metrics.md)).
4. **Expand:** more languages and cities once the pilot shows the north-star metric moving.

## 7. Key business risks

| Risk | Type | Mitigation |
|---|---|---|
| Accuracy of AI reading | Safety / trust | Confirm-the-reading step; track extraction accuracy ([Risks doc](./06-limitations-and-risks.md)) |
| Low direct consumer WTP | Revenue | Lead B2B2C where WTP is high |
| Regulatory scrutiny (health data / advice) | Compliance | Stay strictly "explain existing Rx", clear privacy policy, no diagnosis |
| AI provider cost/availability | Supply | Fallback in place; keep multi-provider optionality |

**Bottom line for a business reader:** a real, expensive, well-documented problem; a differentiated solution already built and deployable; and a credible path to revenue through partners who have both the money and the users. The main open work is *evidence* — proving the adherence lift that unlocks the highest-value buyers.

---
*Figures are cited where sourced. Market-size and WTP statements are framed as method and hypothesis, to be validated — not as researched fact.*
