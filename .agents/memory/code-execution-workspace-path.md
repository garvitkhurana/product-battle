---
name: Code execution workspace path
description: Durable sandbox behavior when writing binary workspace files from an impure CodeExecution function.
---

When an impure CodeExecution function needs an absolute workspace path, obtain it with a shell `pwd` call and pass the resulting string into the function; the sandbox's `process.cwd` is not callable.

**Why:** A GitHub blob synchronization attempt failed before writing because this runtime shadows `process.cwd` with a non-function value.

**How to apply:** Resolve paths with the explicit workspace root and use `fs.writeFile` for binary blobs; do not assume normal Node process APIs inside the impure sandbox.