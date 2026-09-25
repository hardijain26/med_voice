# 03 — How It Works

This is the user's journey, told the way you'd explain it to someone who has never seen the app. No technical terms — those live in the [Glossary](./08-glossary.md).

## The three-tap experience

### Step 1 — Point the camera at the label
The user opens Med-Voice and points their phone at the prescription bottle, box, or paper. That's the only "input" required. No typing, no searching for the medicine by name.

*Why it's designed this way:* the primary user reads slowly and dislikes typing. A photo removes the hardest barrier.

### Step 2 — Med-Voice reads and understands it
Behind the scenes, the app sends the photo to an AI that can *see*. In a few seconds it:

- **Finds the medicine name and dose** (e.g. "Amoxicillin 500mg").
- **Reads the doctor's instructions**, however cryptic.
- **Rewrites everything** into short, warm, everyday sentences.
- **Translates it** into the user's chosen language.
- **Splits the day into moments** — morning, evening — tied to meals and real clock times.
- **Picks out the single most important safety warning.**

The user doesn't see any of this complexity. They just see a clean summary appear.

### Step 3 — Med-Voice speaks and reminds
The app then:

- **Reads the instructions aloud** in the user's language, in a calm, clear voice.
- **Shows a simple schedule** — e.g. "☀️ After breakfast, 8:00 AM — 1 tablet with water" and "🌙 After dinner, 8:00 PM — 1 tablet with water."
- **Offers voice reminders** at each dose time so the medicine is never forgotten.

## What the user ends up with

For a single photo of an Amoxicillin label, a Hindi-speaking user hears and sees something like:

> **Medicine:** Amoxicillin 500mg
> **Spoken (Hindi):** "यह दवा दिन में दो बार खाने के बाद पानी के साथ लें। सुबह 8 बजे और रात 8 बजे लें।"
> **Schedule:** After breakfast (8:00 AM) — 1 tablet · After dinner (8:00 PM) — 1 tablet
> **Warning:** "Don't take on an empty stomach. Call your doctor if you feel unwell."

Clear. Spoken. Timed. In their language.

## The clever bit: sounding right in every language

Some phones can't pronounce every language's script well through their built-in voice. So Med-Voice also produces a **phonetic version** — the same sentence written in English letters (e.g. *"Yeh dawa din mein do baar khane ke baad paani ke saath lein"*). This lets the phone's voice speak it smoothly even when the native script isn't fully supported. The user never notices the trick; they just hear correct pronunciation.

## The safety net: it works even on a bad day

AI services sometimes get overloaded or briefly go offline. Instead of showing the user a scary error, Med-Voice falls back to **safe, pre-prepared guidance in their language** so they're never left stranded. (Details in [Limitations & Risks](./06-limitations-and-risks.md).)

## What it asks permission for, and why

- **Camera** — to take the photo of the label. This is the whole point of the product.
- **Microphone** — reserved for voice interaction features.

These are requested transparently, and the value in exchange is obvious to the user: point the camera, get spoken help.
