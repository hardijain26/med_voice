# 04 — Features & Value

Every feature exists to remove a specific fear or friction for the user. This table maps **what it does → the problem it solves → why it matters**.

| Feature | What it does | The problem it removes | Why it matters |
|---|---|---|---|
| **Photo capture (OCR)** | Reads a prescription label from a single photo. | The user can't read tiny print and won't type medicine names. | Removes the single biggest barrier: no reading, no typing. |
| **Plain-language rewrite** | Converts clinical shorthand into warm, everyday sentences. | "1 cap PO BID p.c." is meaningless to most people. | Turns a puzzle into an instruction anyone can follow. |
| **Audio guide (text-to-speech)** | Speaks the instructions aloud. | Poor eyesight and low literacy make reading unreliable. | The critical information is always available by ear. |
| **Multi-language support (11 languages)** | Delivers everything in the user's own language. | Labels are printed in a language the patient doesn't read well. | Meets the user where they are, not where the pharmacy is. |
| **Phonetic transliteration** | Writes the local-language sentence in English letters for the voice engine. | Some phones mispronounce non-English scripts. | The spoken voice sounds correct in every supported language. |
| **Meal-based dose schedule** | Splits the day into clear moments ("after breakfast at 8 AM"). | "Twice daily" doesn't tell anyone *when*. | Removes guesswork and the risk of double or missed doses. |
| **Safety-warning highlight** | Surfaces the one crucial caution (e.g. "take with food"). | Important warnings get lost in fine print. | Prevents the most common, avoidable mistakes. |
| **Voice reminders / alarms** | Alerts the user at each dose time. | People simply forget doses. | Turns understanding into consistent action. |
| **Graceful fallback** | Provides safe guidance even when the AI is unavailable. | Cloud services occasionally fail or throttle. | The user is never left with an error instead of help. |
| **Optional partner hand-off (webhook)** | Can route processing to a partner's own system when configured. | Clinics/pharmacies may want their own back-end or records. | Makes the product embeddable in partner workflows. |

## The supported languages (today)

Med-Voice currently understands and speaks:

- English
- Hindi (हिन्दी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Bengali (বাংলা)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)
- Spanish (Español)

This coverage was chosen to serve large multilingual senior populations, especially across India, plus Spanish for broad global reach. Adding a language is a content-and-testing task, not a rebuild — see [Roadmap Ideas](./07-roadmap.md).

## Feature themes (how a PM might group these)

- **"Understand it"** → Photo capture, plain-language rewrite, translation.
- **"Hear it"** → Audio guide, phonetic transliteration.
- **"Act on it"** → Meal-based schedule, safety warnings, voice reminders.
- **"Trust it"** → Graceful fallback, transparent permissions.

Each theme is a lever you can invest in independently as the product matures.
