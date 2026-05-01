# GitHub Label Policy

This file records the active GitHub label workflow and the preferred normalized naming.

## Active Workflow Labels

Use these labels in the repository right now:

- `backlog`
- `ready`
- `in-progress`
- `implemented`
- `:owner-review`
- `done`
- `reviewed`

## Meaning

- `backlog`: not ready to start
- `ready`: refined and dependency-clear
- `in-progress`: active implementation is underway
- `implemented`: agent-complete and awaiting human review
- `:owner-review`: explicitly waiting for repository-owner review
- `done`: repository owner accepted the issue
- `reviewed`: repository owner has reviewed the issue

## Required Usage Rules

1. Agents may move issues to `in-progress`, `implemented`, and `:owner-review`.
2. Agents should not mark issues `done`.
3. Only the repository owner should add `done`.
4. Only the repository owner should add `reviewed`.
5. If an issue is `done`, it should also have `reviewed`.

## Preferred Future Normalization

The cleaner long-term naming is:

- `status:backlog`
- `status:ready`
- `status:in-progress`
- `status:implemented`
- `status:owner-review`
- `status:done`
- `reviewed:owner`

## Current To Preferred Rename Map

- `backlog` -> `status:backlog`
- `ready` -> `status:ready`
- `in-progress` -> `status:in-progress`
- `implemented` -> `status:implemented`
- `:owner-review` -> `status:owner-review`
- `done` -> `status:done`
- `reviewed` -> `reviewed:owner`
