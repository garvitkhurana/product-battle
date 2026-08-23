---
name: Authenticated route gates
description: UX rule for account-only areas in YC Battle.
---

Account-only pages must render an explicit sign-in gate before their protected data query is enabled. Public pages and guest battle checkout remain accessible without an account.

**Why:** Letting protected queries run for signed-out visitors produces 401 responses and can leave account pages blank or permanently loading, which makes working navigation look broken.

**How to apply:** For any profile-management, receipt, or submission route, wait for Clerk auth to load, gate signed-out users with a redirect-aware sign-in call to action, and only enable the protected API query for signed-in users.