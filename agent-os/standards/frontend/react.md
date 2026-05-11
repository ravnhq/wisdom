# React Standards

## Component Design

- Build small components with clear responsibilities and typed props.
- Keep page-level components responsible for layout and orchestration only.
- Extract reusable UI only after a second real use case appears, unless the component comes from shadcn/ui.
- Prefer composition over configuration-heavy components.

## State Management

- Use local React state for UI-only interactions.
- Use typed storage hooks or services for persisted extension state.
- Avoid adding global state libraries for the MVP unless React state and extension storage become clearly insufficient.
- Keep derived state derived instead of duplicating it in storage or React state.

## Effects

- Keep `useEffect` narrow and tied to external systems such as storage, timers, or browser APIs.
- Clean up timers, listeners, and subscriptions.
- Avoid putting data transformation logic inside effects; move it to pure functions.

## Accessibility

- Use semantic HTML before custom ARIA.
- Ensure buttons, toggles, dialogs, popovers, and menus are keyboard accessible.
- Use shadcn/ui primitives where they reduce accessibility risk.
- Provide visible focus states and sufficient contrast over nature wallpapers.

## Performance

- Keep new-tab rendering fast and avoid unnecessary network requests.
- Memoize only when there is a measurable or obvious cost.
- Optimize image loading and avoid blocking the initial render with large wallpaper assets.
