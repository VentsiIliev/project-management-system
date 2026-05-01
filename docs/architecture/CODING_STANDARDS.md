# Coding Standards

This document defines the coding standards that implementation agents should follow in this repository.

The goal is maintainable reuse inside this project family, not speculative general-purpose framework design.

## Core Position

Write code for high cohesion, low coupling, and practical reuse within this project family. Prefer simple feature-first structure, explicit contracts, and composition. Use SOLID as a decision filter, not as a reason to over-abstract.

Agents should create shared code at the lowest stable level of abstraction. Keep product-specific behavior in feature or domain modules. Promote code to shared locations only when the behavior, interface, and naming are stable enough to serve multiple features without special-case branching.

## Design Principles

1. Prefer composition over inheritance.
2. Keep each module, component, hook, service, or class focused on one clear responsibility.
3. Depend on stable contracts and boundaries, not incidental implementation details.
4. Keep framework entry points thin. Pages, views, serializers, route handlers, and controllers should orchestrate rather than own business logic.
5. Separate domain logic from delivery logic.
6. Extract shared code only when duplication is real or the abstraction is already stable.
7. Do not create abstractions that are more complex than the duplication they replace.

## Reuse Rules

1. Reuse inside this project family is the target.
2. Shared code must solve a repeated problem across features, not just shorten one implementation.
3. Shared code must have a clear contract and at least one realistic reuse path in this product family.
4. Do not move code into shared locations if it still depends on one workflow, one page, one API shape, or one role-specific rule.
5. Avoid configurable "universal" abstractions that depend on flags, branching, or feature-specific exceptions.
6. Keep business logic close to the owning feature or backend module until the behavior is clearly stable.
7. Share infrastructure and technical patterns broadly. Share business rules cautiously.

## Frontend Standards

Use the repository's approved frontend structure:

- `app/`: bootstrapping, routing, providers, and global wiring
- `features/`: user-facing workflows and feature-specific state or behavior
- `components/`: reusable presentational building blocks
- `lib/`: shared helpers, validation, formatting, low-level hooks, and technical utilities

### Frontend Rules

1. If code contains product-specific workflow meaning, it belongs in `features/`, not `components/` or `lib/`.
2. Shared UI components should be generic and presentational. They should not contain project-specific workflow rules.
3. Shared hooks should expose explicit inputs and outputs and should not depend on one route or one page context unless that is their documented purpose.
4. Prefer building reusable primitives and composing them in feature modules rather than building large multi-purpose components.
5. Keep API access, mutation logic, and server-state orchestration out of presentational components.
6. Validation logic can move to `lib/` only when it is stable and useful across more than one feature.
7. Keep styles easy to change by centralizing tokens, avoiding hardcoded one-off values in feature components, and preferring composable variants over duplicated styling.
8. Put theme values such as colors, spacing, radii, typography, and elevation behind shared tokens or clearly owned style layers so future restyling does not require feature-by-feature rewrites.

See `FRONTEND_STYLE_GUIDE.md` for the concrete token, variant, and theming expectations.

## Backend Standards

Use the repository's approved modular backend structure and keep domain ownership clear.

### Backend Rules

1. Keep views, serializers, and transport adapters thin.
2. Put business rules in domain services, validators, policies, and module-owned orchestration.
3. Do not spread one business rule across multiple unrelated modules unless the boundary is explicit and necessary.
4. Share infrastructure helpers, base integrations, and technical utilities when they are stable and generic enough to help multiple modules.
5. Do not turn project-specific business rules into fake generic shared libraries.
6. Prefer clear service boundaries, policies, selectors, and validators over cross-module shortcuts.
7. Protect high-risk behavior such as workflow transitions, numbering, permissions, dependencies, and locking with explicit backend logic and tests.

## SOLID Interpretation

Use SOLID as a practical bias:

- Single Responsibility Principle:
Keep units focused and cohesive.
- Open/Closed Principle:
Prefer extension through composition and stable interfaces rather than editing shared code for every new case.
- Liskov Substitution Principle:
Do not create inheritance hierarchies unless substitutability is real and enforced by the design.
- Interface Segregation Principle:
Expose small, purpose-fit interfaces instead of broad shared APIs.
- Dependency Inversion Principle:
Depend on stable contracts at module boundaries rather than concrete infrastructure details.

If applying SOLID would force speculative abstraction, keep the simpler design.

## Anti-Patterns

Agents should avoid:

1. Shared folders that become a dumping ground for unrelated code.
2. Generic abstractions created before the second real use case exists.
3. Feature-specific branching inside supposedly reusable components or services.
4. Framework entry points that accumulate domain logic.
5. Helpers that hide side effects or depend on implicit global state.
6. Reuse layers that are harder to understand than the duplicated code they replace.

## Decision Test

Before introducing shared code, ask:

1. Is the responsibility clear and narrow?
2. Is the interface stable enough for more than one feature?
3. Does this reduce coupling rather than spread it?
4. Would another agent know where to use it and where not to use it?
5. Is this solving a repeated problem in this project family rather than an imagined future library need?

If the answer is no to most of these, keep the code closer to the owning feature or module.
