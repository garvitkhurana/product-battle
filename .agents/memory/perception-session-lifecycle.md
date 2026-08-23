---
name: Perception session lifecycle
description: Guard anonymous perception-session creation and recover when a stored token is invalid.
---

Private perception sessions must be owned by one lazy app-level provider, persist the server expiry in browser-local storage, synchronously guard creation, and clear/recreate the token after a server-side invalid-session response. When a validated browser identifier is present, the server must return the same opaque session for concurrent starts rather than minting duplicates.

**Why:** React development remounts and shared-preview contexts can rerun effects before state commits while sharing a browser identity but not tab storage. That can exhaust the otherwise correct database-backed creation throttle and leave private flows spinning. Browser clocks can also disagree with the server clock, causing a valid server expiry to appear already elapsed locally.

**How to apply:** Keep an in-flight ref and module-level promise around client creation; do not start a session until a perception route consumes the provider. Treat the server as authoritative for expiry—validate the expiry shape locally but do not schedule local expiry from the browser clock. Derive reusable tokens only from a server-hashed, validated browser identifier; callers without one must remain subject to the normal creation limit. Session consumers should recognize the private-session 404, clear mutation state, invalidate storage, and retry with the replacement token.

Per-session comparisons are intentionally single-submit. A revisit can receive a 409 duplicate response, which is a completed state rather than a failed vote and should be explained as an already-recorded private signal.

**Why:** The detail page can look unselected after a reload even though the same browser session already submitted that matchup. Treating the duplicate guard as a generic error makes users think voting is broken.

**How to apply:** Preserve the API duplicate protection and map its response to an “already recorded” state in comparison detail UI; do not submit a second signal or claim that login is required.