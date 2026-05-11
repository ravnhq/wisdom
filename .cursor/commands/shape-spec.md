---
name: shape-spec
description: Shape a feature plan and save spec documentation under agent-os/specs.
---

# /shape-spec

Run the Agent OS shaping workflow for significant work.

## Cursor Notes

- Follow the source workflow in `@.claude/commands/agent-os/shape-spec.md`.
- This command should be used from Cursor plan mode.
- This project uses `agent-os/` as the Agent OS directory.
- When the source workflow says to use `AskUserQuestion`, ask the user directly in Cursor chat and wait for the response.
- Ask one question at a time and keep shaping lightweight.

## Output

When the user approves the plan, save spec documentation under `agent-os/specs/`.
