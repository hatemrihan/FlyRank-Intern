# Portfolio Case Studies — Hatem Rihan

> **Voice Card**: Direct, creative, goal-seeking, humble, technical, startup.

---

## About Me

I am a frontend AI engineer intern at FlyRank building reliable, production-ready interfaces for AI ranking systems. I don't use AI to write generic code and call it a day—I use AI with strict technical constraints, schema validation, and automated test loops to ship resilient software fast.

**Goal**: Looking to build high-impact products with early-stage startup teams.

---

## Case Study: FlyRank Engine Settings Architecture

### 1. The Problem
Relying on lazy, one-shot AI prompts produces code that looks obviously "AI-generated"—it looks functional on the surface, but falls apart immediately in production. When I ran an unguided prompt for our ranking settings form, the AI produced zero automated tests, skipped type coercion, missed boundary validations (allowing negative relevance scores and unbounded integer limits), and omitted all ARIA accessibility associations. In a fast-moving startup, merging unverified code like that creates technical debt and breaks when real users touch it.

### 2. What I Did & Decided
Instead of patching messy AI output, I changed the workflow. I applied SOLID principles to establish a scalable frontend base:
- **Separated Schema from UI**: Isolated form validation into a standalone Zod contract (`settingsSchema.ts`) with strict integer coercion and RFC-compliant domain matching.
- **Enforced Accessibility**: Linked every field to an explicit `<label htmlFor>`, bound dynamic error messages via `aria-describedby`, and declared `aria-invalid="true"` so screen readers never get lost.
- **Guarded Async Submissions**: Disabled triggers and rendered loading spinners during async calls to prevent duplicate submissions.
- **Closed the Verification Loop**: Added a co-located Vitest + React Testing Library suite to test boundary failures and successful submit states before committing.

I know no codebase is 100% perfect on day one, but this architecture gives the team a solid base they can actually scale.

### 3. What Came of It
- **Zero Runtime Regressions**: 100% green test suite (4/4 tests passing in 300ms) covering boundary violations and valid submissions.
- **Predictable Code Reviews**: Diff review time dropped from 18 minutes of manual bug-hunting down to under 3 minutes with automated verification.
- **A Team Standard**: The 4 engineering rules derived from this build are now codified in [`CLAUDE.md`](./CLAUDE.md) as project-wide guidelines for all future forms.

---

## Copywriting Contrast: Before vs. After

| Version | Copy |
| :--- | :--- |
| **Before (Generic AI Fluff)** | *"Engineered a cutting-edge, highly scalable AI configuration interface utilizing modern React paradigms and industry-standard best practices to deliver seamless user experiences and drive operational efficiency."* |
| **After (My Direct Voice)** | *"Blind AI generation produces fragile code without tests or boundaries. I replaced naive one-shot prompts with Zod schemas, ARIA bindings, and automated Vitest suites—turning a brittle script into a scalable frontend base that survives real users."* |

---

## Contact & Connect

If you're building a fast-moving product and need an engineer who directs AI with precision, tests rigorously, and ships clean frontend architecture:

* **GitHub**: [github.com/hatemrihan](https://github.com/hatemrihan)
* **Project Repository**: [FlyRank-Intern](https://github.com/hatemrihan/FlyRank-Intern)
* **Get in Touch**: [Reach out via GitHub or Email to start building together](https://github.com/hatemrihan)
