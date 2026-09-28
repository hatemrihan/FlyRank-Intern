# AI-Assisted Workflow Drill (FE-03) — Evaluation & Diff Analysis

## Overview
This drill contrasted two workflows for building the FlyRank Engine Settings form:
- **Round 1 (`drill/round-1-vague`)**: Generated via an unconstrained single-sentence prompt: *"Make a settings form with validation for FlyRank."*
- **Round 2 (`drill/round-2-spec`)**: Directed via an architectural specification with schema validation, accessibility constraints, edge-case criteria, and an automated verification loop.

---

## 1. Correctness & Caught AI Mistake
In Round 1 (`SettingsForm.tsx:23-33`), the AI generated naive ad-hoc validation inside a custom `validate()` function:
```tsx
// Round 1: SettingsForm.tsx lines 24-29
if (topK <= 0) {
  errs.topK = 'Top K results must be greater than 0';
}
if (minScore > 1) {
  errs.minScore = 'Score cannot exceed 1.0';
}
```
**Specific AI Mistake Caught**: The AI missed critical boundary and type constraints. `topK` allowed non-integer decimals (e.g., `10.5`) and unbounded upper limits (e.g., `1,000,000`). For `minScore`, the AI checked only the upper bound (`> 1`), completely permitting negative thresholds like `-0.85`. Furthermore, `domainFilter` checked `!domainFilter.includes('.')`, falsely validating invalid strings like `'...'` or `'a.b'`.

In Round 2, the schema was extracted into [`src/schemas/settingsSchema.ts:11-30`](file:///Users/hatemrihan/Desktop/FlyRank./Main/weeks/week2/src/schemas/settingsSchema.ts#L11-L30) using Zod:
```ts
// Round 2: settingsSchema.ts lines 11-25
topK: z.number().int('Top-K results must be a whole integer').min(1).max(100),
minScore: z.number().min(0, 'Minimum score threshold cannot be less than 0.0').max(1),
domainFilter: z.string().trim().optional().refine(val => !val || DOMAIN_REGEX.test(val), ...)
```
Every input is deterministically validated against typed boundaries before form submission.

---

## 2. Accessibility (a11y)
- **Round 1 (`SettingsForm.tsx:64-95`)**: Inputs used unassociated `<div>` wrappers instead of `<label htmlFor="...">`. Screen readers could not determine label context or connect error messages to the respective controls (`aria-invalid` and `aria-describedby` were absent).
- **Round 2 (`SettingsForm.tsx:70-195`)**: Every form field declares explicit `<label htmlFor="id">`. When validation fails, inputs toggle `aria-invalid="true"` and bind to `<p id="[field]-error" role="alert">` via `aria-describedby`. Submission results are announced via an accessible live region (`role="status"`, `aria-live="polite"`).

---

## 3. Edge Cases & UX States
- **Double Submissions**: Round 1 allowed repeated clicks during async saves without disabling triggers. Round 2 guards against race conditions by tracking `isSubmitting`, disabling buttons and displaying a visual loading indicator.
- **Form Purity**: Round 2 tracks `isDirty` to conditionally enable a "Reset" button that restores `defaultSettings`.

---

## 4. Review Effort & Time
- **Round 1**: Prompting took 10 seconds, but code review and bug identification required ~18 minutes to spot missing boundary logic, lack of ARIA semantics, and absence of tests.
- **Round 2**: Upfront specification took ~2 minutes. The code was delivered alongside a green 4-test Vitest suite ([`SettingsForm.test.tsx`](file:///Users/hatemrihan/Desktop/FlyRank./Main/weeks/week2/src/components/__tests__/SettingsForm.test.tsx)), reducing review time to under 3 minutes with total confidence.
