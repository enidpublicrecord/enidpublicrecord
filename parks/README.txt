EPR Parks — A7.10 Outdoors Default

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.9 Dark Raster Fix

Fix:
- Parks now ALWAYS opens on the EPR Outdoors basemap.
- Map style is no longer persisted in localStorage.
- Any stale epr-parks-map-style value from earlier builds is cleared on startup.
- Dark still works during the current session and remains active while panning/zooming.
- Reloading the app intentionally returns to Outdoors.

All A7.9 trail, fishing, walk, events, Archie, Passport, zoom and privacy behavior is preserved.
Production Atlas is not changed by this patch.
