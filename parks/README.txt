EPR Parks Prototype A7.2 — Smooth Map

EPR Parks — A7.1 EPR Outdoors
2026-09-27

PURPOSE
Phone-test hotfix and cartographic identity pass for EPR Parks.

WHAT CHANGED
1. EPR Outdoors basemap: Parks now prefers OpenFreeMap vector cartography rather than the Atlas-style raster map. Parks can therefore reduce label size, suppress oversized highway shields/POI clutter, soften roads, and emphasize land/water/park colors.
2. Fallback map: if the vector basemap cannot load, a softened OpenStreetMap raster appears automatically.
3. Trails: interactive TrailMaster geometry is still preferred. If the mobile browser blocks the cross-origin geometry request, Parks automatically shows the City TrailMaster through a no-CORS ArcGIS rendered-map overlay rather than displaying “Trails not loaded.”
4. Trail status controls remain meaningful in fallback mode: current, design/development, and exploration/future are requested as separate City-rendered overlays.
5. Trail detail cards remain evidence-controlled: segment-specific tap details are only enabled when interactive geometry actually loads.
6. Map labels remain available from Layers; the default style is already reduced and highway shields are suppressed. Reset returns to the normal EPR Outdoors view.

PRESERVED
- A7 walk tracker / Follow mode
- events and event-watch preferences
- Archie guides
- Park Passport
- Evidence Lens
- Google Analytics G-6ZVETTNBV4
- production Atlas untouched

ROLLBACK
A7 Outdoor Mode remains the protected production rollback baseline until A7.1 passes hosted Android QA.

LIVE QA AFTER UPLOAD
- Confirm the basemap has smaller labels and no dominant US-60/US-412 shield.
- Confirm trails become interactive colored lines OR a visible City trail overlay instead of “Trails not loaded.”
- If fallback trails are active, tap the trail legend and confirm the app explains that segment details are unavailable rather than guessing.
- Toggle More > Layers > Map labels off/on.
- Start/Pause/Resume/Finish Walk.
- Confirm Passport, Archie, Events and Reset still work.

MAP ATTRIBUTION
The EPR Outdoors vector basemap uses OpenFreeMap / OpenMapTiles with OpenStreetMap data. Attribution is shown on-map.

A7.2 changes:
- smoother mobile pinch/pan tuning for Leaflet + OpenFreeMap bridge
- GL canvas made pointer-transparent so Leaflet owns touch gestures
- fractional zoom snapping and normal zoom animation restored
- simplified leaf-only EPR Parks icon; no unreadable micro-text
- main Enid Public Record homepage link moved to About & privacy instead of the top brand, avoiding accidental exits during walks
