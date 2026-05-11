---
name: discover-standards
description: Extract concise project standards from codebase patterns into agent-os/standards.
---

# /discover-standards

Run the Agent OS workflow for discovering and documenting project standards.

## Cursor Notes

- Follow the source workflow in `@.claude/commands/agent-os/discover-standards.md`.
- This project uses `agent-os/` as the Agent OS directory.
- When the source workflow says to use `AskUserQuestion`, ask the user directly in Cursor chat and wait for the response.
- Process one standard at a time: ask, draft, confirm, then create or update the file.

## Output

Create or update standards under `agent-os/standards/`, then update `agent-os/standards/index.yml`.
