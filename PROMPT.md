Build: Offline-First Questionnaire PWA with QR Scan-In and QR Data Export

## Goal

Build a production-quality, fully offline-capable Progressive Web App for collecting questionnaire responses in research/field settings. Each session is identified by a participant ID and a scenario, set either by scanning a QR code or manual entry. After completing 10 mixed-modality questions, the app generates a QR code containing all collected data (for scanning at a central data-collection station) and offers downloads in CSV, XLSX, TXT, and XML formats.

## Tech stack (you decide the specifics, but constraints below)

- **Framework:** Pick what you judge best for a small, fast, fully offline PWA. React + Vite + TypeScript is a strong default; justify briefly if you go elsewhere.
- **Styling:** Tailwind CSS. Mobile-first. Clean, accessible, readable in bright outdoor light (high contrast, large tap targets ≥44px).
- **State:** Lightweight (Zustand or React Context). Persist to IndexedDB so a partially-completed questionnaire survives a reload or accidental close.
- **Offline:** True PWA — manifest.webmanifest, installable, service worker that precaches the app shell. Use Vite's PWA plugin (vite-plugin-pwa) with Workbox. Must work with zero network after first load.
- **No backend.** Everything runs client-side.

## Core libraries (use these, don't reinvent)

- **QR scanning:** html5-qrcode or @zxing/browser — pick one, justify briefly
- **QR generation:** qrcode (npm)
- **XLSX export:** xlsx (SheetJS) or exceljs
- **XML:** hand-rolled or xmlbuilder2
- **CSV:** hand-rolled (small enough); properly quote fields containing commas/quotes/newlines

## App flow

### 1. Landing / Session Setup

Two ways to set the participant ID and scenario:

- **Scan QR:** Camera opens, scans a QR containing JSON like `{"participantId": "P042", "scenario": "scenario-A"}`. Validate shape, show error if malformed.
- **Manual entry:** Two text fields. Participant ID is required (non-empty, trimmed). Scenario is a dropdown populated from a config (see below) — no free text, to keep data clean.

After either method, show a confirmation screen: "Participant: P042 — Scenario: scenario-A. Start questionnaire?" with Confirm/Edit buttons.

### 2. Questionnaire (10 questions, mixed modalities)

Define the questions in a single config file (`src/config/questionnaire.ts`) so they're easy to edit. Use these modalities — include at least one of each, distributed across the 10 questions:

1. Likert rating (1–5) with labeled endpoints (e.g., "Strongly disagree" → "Strongly agree")
2. Star rating (1–10)
3. Single-select (radio buttons, 3–5 options)
4. Multi-select (checkboxes, 4–6 options, optional min/max constraints)
5. Slider (numeric range, e.g., 0–100, with current value shown)
6. Yes/No/Not sure (three-button toggle)
7. Short text (single-line, with maxlength)
8. Long text (textarea, optional)
9. Numeric input (with min/max validation, e.g., age 18–120)
10. Ranking (drag-to-reorder a list of 4–5 items, OR if drag is too heavy, use up/down arrows)

Each question type must be a separate, reusable component. Validation per question; "Next" disabled until valid (unless explicitly optional). Show progress (e.g., "Question 4 of 10" + progress bar). Allow Back navigation without losing answers.

Provide a sensible example questionnaire — pick a plausible research theme (e.g., "user experience after a guided task" or "post-scenario subjective workload") so the demo is coherent rather than 10 random questions. Document at the top of the config that this is example content.

### 3. Review screen

Before submission, show all 10 answers in a compact list with edit links per question.

### 4. Export screen

On submit, build a single data object:

```json
{
  "schemaVersion": 1,
  "participantId": "string",
  "scenario": "string",
  "startedAt": "ISOString",
  "completedAt": "ISOString",
  "deviceInfo": { "userAgent": "...", "language": "...", "timezone": "..." },
  "answers": [
    { "id": "q1", "type": "likert5", "question": "...", "answer": 4 }
  ]
}
```

Then offer:

- **QR code** containing the JSON (encoded as compact JSON, no whitespace). Use error correction level M. If the JSON exceeds the practical QR capacity (~2000 chars at level M), display a clear warning: "Data too large for a single QR — consider shortening text answers or use the file download." Do not auto-fall-back to multi-QR chunks (out of scope). Show the QR large enough to scan from ~30cm.
- **Downloads** as four buttons:
  - **CSV** — flat: one row per answer (participantId, scenario, questionId, questionText, answerType, answerValue), plus header row. Multi-select / ranking values joined with `|`.
  - **XLSX** — two sheets: `Session` (metadata key/value) and `Answers` (same columns as CSV).
  - **TXT** — human-readable: header block with metadata, then `Q1: <question>\nA1: <answer>\n\n` for each.
  - **XML** — well-formed, with a root `<session>` element, metadata children, and `<answers><answer id="q1" type="likert5">...</answer></answers>`. Properly escape `<`, `>`, `&`, `"`.

Filenames: `questionnaire_<participantId>_<scenario>_<YYYYMMDD-HHmm>.<ext>`. Sanitize participant ID and scenario for filesystem safety.

A "New session" button on this screen returns to step 1 and clears IndexedDB session state (with a confirm dialog).

## Non-functional requirements

- **Accessibility:** Keyboard navigation works end-to-end. ARIA labels on all interactive elements. Color contrast AA minimum. Focus visible.
- **Mobile-first** but works fine on desktop. Test mental model: a researcher hands a phone to a participant.
- **No analytics, no telemetry, no external calls at runtime.** Privacy is the point.
- **Permissions:** Camera permission requested only when scan QR is tapped, with a graceful fallback message if denied.
- **Error handling:** Camera unavailable → fall back to manual. Storage quota exceeded → clear error. Malformed scanned QR → toast + retry.
- **Resilience:** Closing the tab mid-questionnaire and reopening should restore the in-progress session (IndexedDB).

## Project structure (suggested)

```
src/
  components/
    questions/        # one file per question type
    qr/               # QrScanner.tsx, QrDisplay.tsx
    ui/               # buttons, progress, etc.
  config/
    questionnaire.ts  # the 10-question definition
    scenarios.ts      # scenario dropdown options
  lib/
    storage.ts        # IndexedDB wrapper
    export/
      csv.ts
      xlsx.ts
      txt.ts
      xml.ts
  pages/              # or routes
    Setup.tsx
    Questionnaire.tsx
    Review.tsx
    Export.tsx
  pwa/                # manifest, icons, sw config
  App.tsx
  main.tsx
```

## Deliverables

1. Full source tree.
2. README.md with: install, dev, build, how to deploy as a static PWA (e.g., GitHub Pages / Netlify), how to edit the questionnaire config, and notes on QR data-size limits.
3. Working `npm run dev` and `npm run build`.
4. App icons (placeholder is fine — provide a simple SVG that's converted to the required PNG sizes).
5. A short SAMPLE_QR.md showing the JSON format expected for the setup-QR, plus a generated example QR image (or instructions to generate one with qrcode CLI).

## Quality bar

Treat this as code that will actually be used in a small research study. No TODOs left in code. No console errors. Lighthouse PWA audit should pass installability and offline checks. Types throughout (if TS). Sensible component splits — no 800-line files.

## Build order (suggested)

1. Scaffold Vite + PWA + Tailwind, confirm installable + offline shell works.
2. Setup page (manual entry first, then QR scan).
3. One question component end-to-end (Likert), then the rest.
4. Persistence + resume.
5. Review screen.
6. Export: CSV → TXT → XML → XLSX → QR (QR last, so the data shape is settled).
7. Polish: a11y, error states, README.

Build it.
