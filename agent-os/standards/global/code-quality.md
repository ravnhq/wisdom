# Code Quality Standards

## Principles

- Optimize for clear, maintainable code before clever abstractions.
- Keep MVP scope small, but hold production-quality standards for correctness, accessibility, privacy, and testability.
- Prefer explicit data flow, typed boundaries, and pure utilities for logic that is easy to test.
- Add abstractions only when they remove meaningful duplication or isolate browser/platform complexity.

## TypeScript

- Use strict TypeScript and avoid `any`; prefer `unknown` with narrowing when data shape is not guaranteed.
- Define domain types for quotes, wallpapers, blocked sites, settings, and storage records.
- Keep shared types close to the feature unless they are used across multiple surfaces.
- Use discriminated unions for state that has clear modes, such as loading, ready, empty, and error.

## Module Boundaries

- Keep UI components focused on rendering and interactions.
- Put business logic in pure utilities or small services, especially URL matching, quote selection, JSON validation, and storage access.
- Keep extension API calls behind typed wrappers so UI code does not depend directly on browser APIs.
- Avoid global mutable state outside extension storage wrappers and React state management.

## Errors

- Fail early for invalid bundled data, especially quote and wallpaper JSON.
- Show calm, user-friendly fallback UI when recoverable extension state cannot load.
- Do not silently ignore extension API failures; log useful development errors without exposing noisy messages to users.

## Comments

- Use comments to explain non-obvious browser extension behavior, permissions decisions, or tricky URL matching.
- Do not comment code that is already self-explanatory.
