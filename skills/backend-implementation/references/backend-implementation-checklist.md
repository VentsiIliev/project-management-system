# Backend Implementation Checklist

## Before Coding

1. Read the relevant `issues/stories/*.md` file.
2. Read the matching spec section for rules and invariants.
3. Confirm the owning backend module.

## During Coding

1. Keep views and serializers thin.
2. Put business rules in services, validators, or policies.
3. Add transactions where concurrency matters.
4. Keep audit and notification side effects explicit.
5. Preserve structured error behavior.

## High-Risk Areas

1. Number generation
2. Dependency creation and deletion
3. Circular dependency checks
4. Blocked-state computation
5. Status transitions
6. Role and membership permissions

## Before Finishing

1. Re-check the story acceptance criteria.
2. Re-check invariants and permission rules.
3. Add or update unit and integration tests.
4. Confirm the implementation still matches `IMPLEMENTATION_ARCHITECTURE.md`.
