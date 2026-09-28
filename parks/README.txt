EPR Parks — A7.7 Trail Clarity + Dark Fix

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.6 Dark Map Fix

Key changes
- Future/exploration trails are red dotted lines and explicitly labeled NOT USABLE / not for navigation.
- Start Walk is disabled on design/development and future planning lines.
- Dark mode now uses the same working OpenFreeMap Liberty vector source as Outdoors and applies EPR dark styling locally, avoiding a separate dark-style endpoint.
- Dark mode retains the no-key OSM-derived raster fallback if vector loading fails.
- Visible version labeling is unified at A7.7 and the PWA cache is bumped.
- Existing fishing, events, Archie, Passport, walk tracking, Trail Explorer, Terrain, Satellite and zoom 22 behavior are preserved.

Production Atlas is not changed by this patch.
