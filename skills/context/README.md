# Shared Agent Context

Use this folder for durable context that future agents should be able to reuse without rereading the full repo history.

## Subfolders

- `patterns/`: implementation patterns and where to apply them
- `decisions/`: technical decisions, tradeoffs, and rationale
- `handoffs/`: short notes that help the next agent continue work cleanly

## Writing Rules

1. Keep entries short and specific.
2. Prefer one topic per file.
3. Include the date in the filename as `YYYY-MM-DD`.
4. State where the pattern or decision applies.
5. State why it exists and when not to use it.
6. Update an existing file if the topic already exists instead of creating duplicates.
