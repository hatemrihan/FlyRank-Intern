# FlyRank project conventions

## Stack
- Use a simple, modern web stack that is easy to explain in the capstone demo.
- Prefer clear TypeScript and readable component structure.
- Keep configuration lightweight and documented.

## Workflow
- Use Conventional Commits for all commits.
- Update the README whenever the project scope changes.
- Keep the repository tidy with a small, focused set of files.

## Notes
- This repository is intentionally scaffolded for a capstone submission.
- Add implementation work incrementally and keep changes easy to review.

## Engineering & Form Rules (Learned from FE-03)
- **Schema Validation**: All forms must define validation schemas using Zod (`z.object`) with explicit numeric/string boundaries (e.g., `.int()`, `.min()`, `.max()`, `.trim()`) and inferred types. Never use uncontrolled inputs or ad-hoc component `if` checks.
- **Accessibility (a11y)**: Every input must link to a semantic `<label htmlFor="...">`. Error messages must declare unique IDs associated to inputs via `aria-describedby` and toggle `aria-invalid="true"`.
- **Submission Lifecycle**: Submit buttons must be disabled with an active loading state while `isSubmitting` is true. Success and failure notices must be announced via ARIA live regions (`role="status"`, `aria-live="polite"`).
- **Automated Verification**: Every form component must include co-located Vitest + React Testing Library tests covering initial render, boundary violation error messages, and successful submit flows.
