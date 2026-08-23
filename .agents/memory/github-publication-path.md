---
name: GitHub publication path
description: How public GitHub commits are published from this workspace when the shell Git remote is Replit-only.
---

Publish the project’s public GitHub commits through the managed GitHub connection, not the default shell `git push`.

**Why:** The workspace tracks Replit’s `gitsafe-backup` remote by default, which preserves checkpoints but does not update the public GitHub repository.

**How to apply:** When a user asks to make project changes visible on GitHub, use the authenticated GitHub connection and create the commit on the target branch. For full-tree syncs, stage Git blobs in sequential batches before creating the tree and commit; large concurrent blob batches can fail in the connector runtime.