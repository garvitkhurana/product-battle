---
name: Ecosystem queue expansion
description: Rules for safely extending an anonymous perception queue from Ecosystem.
---

Anonymous perception sessions can extend beyond the launch cohort through sequential batches of ten curated comparisons. An expanded queue is bound to the currently valid private session, and the server—not browser storage—authorizes which batch is recordable.

**Why:** Browser state can outlive an expired or replaced anonymous session. Binding stored batches to their session prevents stale comparisons from leaking into a fresh queue or skipping the intended batch progression. Session capabilities also must not appear in URLs, which may be retained in browser or proxy logs.

**How to apply:** Any new queue-continuation flow should request the next batch with the session token in a request body, validate and clear persisted batch data when the session changes or expires, and let the server derive the current allowed batch from recorded comparisons. New curated rivalries should join the shared curated order so they naturally become available only after earlier batches are completed.