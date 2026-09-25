# 06 — Limitations & Risks

Honest limits build trust and make prioritization easier. This is what the product *cannot* do today, what could go wrong, and how each risk is (or should be) handled.

## What Med-Voice is not

- **Not medical advice.** It explains an existing prescription in simpler words. It does not decide whether a medicine is appropriate, check for drug interactions, or replace a doctor or pharmacist.
- **Not a diagnosis tool.** It reads labels; it does not assess symptoms.
- **Not a records system (yet).** It guides one label at a time; it does not maintain a full medication history.

## Key risks and how they're handled

### 1. The AI misreads the label
**Risk:** A blurry photo, an unusual label layout, or handwriting could lead to a wrong medicine name, dose, or timing. In a health product, that's the most serious failure.

**Handled by / to strengthen:**
- The app is designed to extract the *exact* medicine name and dose and to highlight warnings.
- **Recommended safeguards:** show the user the extracted name/dose for a quick confirmation, add capture guidance ("hold steady, get closer"), and always display an easy "this looks wrong" path. Treat extraction accuracy as a tracked safety metric ([Success Metrics](./05-success-metrics.md)).

### 2. The AI service is overloaded or offline
**Risk:** The cloud AI can throttle or fail, which would normally mean an error screen at the worst moment.

**Handled by:** a **graceful fallback**. When the AI can't respond, Med-Voice serves safe, pre-prepared guidance in the user's language instead of failing. The user always gets *something* usable.

> ⚠️ **Important nuance for the PM:** the fallback returns a *generic sample* prescription, not the user's actual label. This protects against a blank error, but it must never be mistaken for the real reading. **Action item:** the fallback should be clearly labeled as a general example and prompt the user to retry, so it can never be confused with their specific medicine.

### 3. Translation nuance
**Risk:** Medical phrasing across 11 languages can carry subtle differences; a slightly-off phrasing could mislead.

**Handled by / to strengthen:** the rewrite is tuned to be warm and simple, with phonetic support for correct pronunciation. **Recommended:** periodic native-speaker review of the phrasing for each language, especially for warnings.

### 4. Privacy of health information
**Risk:** Prescription photos are sensitive personal health data.

**Handled by / to strengthen:** camera and microphone permissions are requested transparently. **Recommended:** a clear, plain-language privacy statement about what happens to a photo, minimal retention, and never using health data for anything beyond serving the user.

### 5. Dependence on a smartphone and a helper
**Risk:** The core user may not own or confidently operate a smartphone; initial setup often needs a family member.

**Handled by / to strengthen:** the three-tap design minimizes complexity. **Recommended:** a guided "set up for a loved one" flow for caregivers ([Roadmap Ideas](./07-roadmap.md)).

### 6. Reliance on a single AI provider
**Risk:** The product depends on one external AI provider; pricing, availability, or policy changes there affect the product.

**Handled by / to strengthen:** the fallback reduces user-facing impact. **Recommended:** keep the option to route to alternate providers or a partner system (the webhook hand-off already hints at this flexibility).

## Summary risk table

| Risk | Severity | Current mitigation | Recommended next step |
|---|---|---|---|
| Misread label | High | Targeted extraction + warnings | Add user confirmation of name/dose |
| AI unavailable | Medium | Graceful fallback | Clearly label fallback as a sample |
| Translation nuance | Medium | Warm, simple rewrite + phonetics | Native-speaker review per language |
| Health-data privacy | High | Transparent permissions | Plain-language privacy policy |
| Device/setup barrier | Medium | Three-tap design | Caregiver setup flow |
| Single AI dependency | Medium | Fallback + webhook option | Multi-provider capability |
