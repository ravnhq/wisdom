---
name: inject-standards
description: Load relevant Agent OS standards into the current Cursor conversation.
---

# /inject-standards

Run the Agent OS workflow for injecting relevant standards into the current context.

## Cursor Notes

- Follow the source workflow in `@.claude/commands/agent-os/inject-standards.md`.
- This project uses `agent-os/` as the Agent OS directory.
- When the source workflow says to use `AskUserQuestion`, ask the user directly in Cursor chat and wait for the response.
- Support both auto-suggest mode and explicit arguments like `api` or `api/response-format`.

## Output

Read relevant files from `agent-os/standards/` and summarize the key points for the current task.
