EPR Parks — A7.11 True Dark

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.10 Outdoors Default

Fix:
- Outdoors remains the startup/default map.
- Dark now uses a stronger true night treatment instead of the washed gray result seen on Android.
- Dark remains a separate Leaflet raster pane, so it cannot be repainted by the Outdoors vector style.
- Reloading still returns to Outdoors.
- All trail, fishing, events, walk, Archie, Passport and privacy behavior is preserved.

Production Atlas is not changed by this patch.
