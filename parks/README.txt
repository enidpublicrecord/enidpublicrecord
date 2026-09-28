EPR Parks — A7.9 Dark Raster Fix

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.8 Persistent Dark

Key changes
- Replaces the unreliable Dark vector-style treatment with a dedicated Leaflet raster basemap pane.
- Dark uses ordinary OpenStreetMap tiles recolored locally on that dedicated pane, so MapLibre style refreshes cannot repaint it light.
- Removes the previous Dark dependence on the OpenFreeMap style lifecycle.
- Keeps zoom to level 22 and preserves Outdoors, Terrain and Satellite.
- Future/exploration trails remain red dotted and explicitly NOT USABLE / not for navigation.
- Fishing, Trail Explorer, walk tracking, events, Archie, Passport and GPX export are preserved.
- Service-worker registration now bypasses HTTP cache for sw.js and the PWA cache is bumped.

Production Atlas is not changed by this patch.
