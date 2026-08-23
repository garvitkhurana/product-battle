---
name: GitHub empty repository bootstrap
description: How to seed a new GitHub repository when the connector blocks Git database writes on an empty repository.
---

When pushing a project through the GitHub connector, initialize an empty newly-created repository through the Contents API before using Git database endpoints. A `PUT` for a tracked file such as `README.md` creates the first commit; afterward, tree, commit, and ref operations work normally.

**Why:** The connector returned `409 Git Repository is empty` for Git blob and tree writes to a repository created without an initial commit. It also lacked admin rights to delete that empty repository, so recreating it was not reliable.

**How to apply:** For a new repository, prefer creation with `auto_init` where possible. If it is already empty, use the Contents API to create the initial `main` commit, then upload the remaining project tree. Keep Git API requests under the connector's 10 requests/second limit.