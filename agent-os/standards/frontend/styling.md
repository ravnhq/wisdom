# Styling Standards

## System

- Use Tailwind CSS as the primary styling system.
- Use shadcn/ui components as editable local building blocks, not as untouchable black boxes.
- Use Lucide React for icons to keep visual style consistent.
- Use Sass only when Tailwind becomes awkward for reusable, complex, or generated styling.

## Visual Direction

- Keep the UI calm, focused, and polished with strong spacing, typography, and contrast.
- Nature wallpapers must support legible overlays with gradients, scrims, or cards when needed.
- Treat the new-tab page as the main product surface: it should feel intentional, fast, and uncluttered.
- Avoid decorative complexity that distracts from the quote and focus-mode action.

## Component Styling

- Prefer component variants for repeated button, card, popover, and toggle styles.
- Keep Tailwind class lists readable; extract helpers when class composition becomes noisy.
- Use responsive layouts even for extension pages, since browser window sizes vary.
- Do not hardcode colors in many places; centralize theme tokens through Tailwind and shadcn conventions.

## Motion

- Use subtle transitions for focus-mode toggles, quote changes, and explanation popovers.
- Avoid motion that delays interaction or makes blocked pages feel playful instead of calming.
- Respect reduced-motion preferences.
