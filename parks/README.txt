EPR Parks — A7.6 Dark Map Fix

PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.5 Fishing Sites

What changed
- Replaced CARTO Dark Matter raster tiles after the hosted service began returning visible “API KEY REQUIRED” tiles.
- Dark mode now uses OpenFreeMap's no-key dark vector style through the same MapLibre/Leaflet bridge used by EPR Outdoors.
- Map-label visibility works in Dark through vector symbol layers.
- Added a no-key OpenStreetMap darkened fallback if the vector style does not load.
- Preserves Fishing, Trail Explorer, active walk tracking, events, Archie, Passport, GPX export and max zoom 22.
- Production Atlas is untouched.

Phone QA
1. Open More > Map style > Dark. No API-key watermark should appear.
2. Pinch zoom repeatedly in and out.
3. Toggle Map labels off/on in Layers while Dark is active.
4. Confirm park/trail/fishing markers stay above the basemap.
5. Switch Dark > Outdoors > Satellite > Dark and verify state remains stable.
