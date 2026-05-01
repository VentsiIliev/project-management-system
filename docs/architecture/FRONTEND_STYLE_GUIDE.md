# Frontend Style Guide

This document defines the styling contract for frontend agents working in this repository.

The goal is visual consistency, low-friction customization, and cheap future restyling across this project family.

## Core Position

Frontend styling should be easy to change at any point without feature-by-feature rewrites. Agents should prefer shared tokens, reusable variants, and composable layout primitives over hardcoded one-off values.

## Styling Priorities

1. Make visual changes cheap.
2. Keep the design system cohesive across features.
3. Keep feature workflow logic separate from presentational styling.
4. Make tokens and variants easy to discover and update.

## Token Rules

Themeable values should not be buried in feature components when they are likely to change later.

Centralize tokens for:

- colors
- typography
- spacing
- radii
- shadows or elevation
- border styles
- motion timings and easing
- z-index layers where needed

Prefer semantic token names over raw visual names when possible.

Examples:

- good: `--color-surface-primary`
- good: `--space-panel-gap`
- avoid: `--blue-500`
- avoid: `--margin-12`

## Component Styling Rules

1. Shared components should expose reusable variants instead of duplicating near-identical classes.
2. Shared components should not encode feature-specific workflow meaning in their styling API.
3. Feature components may compose shared primitives, but should avoid inventing their own mini design systems.
4. If a visual pattern appears in more than one feature, promote it to a shared component, shared variant, or shared token layer.
5. Avoid hardcoded spacing, radii, colors, and typography values inside feature code when those values are part of the general UI language.

## Layout Rules

1. Reuse layout primitives for common patterns such as page shells, panels, stacks, grids, and action bars.
2. Keep page-level spacing predictable and token-driven.
3. Prefer consistent responsive rules instead of one-off breakpoint hacks.

## State Styling Rules

Define consistent styling patterns for:

- loading
- empty states
- validation errors
- permission denied
- network failure
- conflict states
- success and destructive actions

Agents should reuse those patterns rather than inventing new state presentations per feature.

## Tailwind Usage Rules

1. Use Tailwind as the implementation tool, not as permission to hardcode every style inline.
2. Prefer shared component variants, shared utility composition, or token-backed class patterns when the same visual language repeats.
3. If the same utility cluster appears repeatedly, extract it.
4. Keep arbitrary values rare and justified.

## File Ownership

- `frontend/src/styles/`: global tokens, theme layers, and shared visual foundations
- `frontend/src/components/`: reusable presentational primitives and shared variants
- `frontend/src/features/<feature>/components/`: feature-owned UI that still follows the shared style language
- `frontend/src/lib/`: technical helpers, not visual dumping grounds

## Decision Test

Before adding new styling, ask:

1. Should this be a token?
2. Should this be a shared variant?
3. Should this be a reusable layout primitive?
4. Is this styling specific to one feature, or part of the broader UI language?
5. Would a future restyle require touching many feature files because of this decision?

If the answer to the last question is yes, the styling is probably too local or too hardcoded.

## Anti-Patterns

Avoid:

1. repeated hardcoded colors, spacing, and radii across features
2. large page components carrying all visual rules inline
3. feature-specific copies of shared card, button, modal, or table styling
4. arbitrary values used where a token or variant should exist
5. styling APIs that mix presentation with workflow rules
