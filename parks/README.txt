EPR Parks Prototype A7.3 — Trail Explorer

EPR Parks — A7.3 Trail Explorer
2026-09-28

PURPOSE
Make Enid trails obvious and easy to understand without turning Parks into a cluttered GIS dashboard. Give Parks its own outdoor identity with multiple basemap choices while preserving the privacy-first walk tracker, events, Archie guides, Passport and Evidence Lens.

WHAT CHANGED
1. Trail Explorer is now a first-class destination. “Explore trails” appears in the hero, the right-side trail control, the compact trail card and the More menu.
2. Current-first trail UX. Reset/default shows only the current City TrailMaster category. Design/development and exploration/future linework are deliberately separated so planning geometry is not mistaken for a currently walkable route.
3. Trail Explorer choices: Current trails, Trails near me, Full trail map, and Future network.
4. Interactive trail cards now include evidence-controlled name/status fields, approximate mapped length when geometry is available, Fit trail, City source, and Start walk. Starting a walk from a selected trail carries the trail name into the local walk record.
5. Four basemap choices:
   - Outdoors — default EPR park-first vector style using OpenFreeMap/OpenStreetMap.
   - Terrain — OpenTopoMap topographic context.
   - Satellite — Esri World Imagery.
   - Dark — OpenFreeMap dark style for lower-glare use.
6. Basemap switching does not change EPR park, trail, event or evidence overlays.
7. The compact lower-left trail card now acts as an invitation to explore rather than exposing technical segment counts first.
8. A7.2 smooth-pinch behavior, leaf-only EPR Parks mark, and About-page homepage link are preserved.

TRAIL DATA
Interactive geometry still comes from the City of Enid TrailMaster service. If browser cross-origin behavior prevents the geometry request, the app keeps the City rendered trail-overlay fallback rather than inventing line details.

PRIVACY
- GPS walk routes remain device-local unless the user deliberately exports/shares them.
- Coordinates and route traces are not sent to Google Analytics.
- “Trails near me” asks for location only after the user chooses it.
- Basemap choice is stored locally for convenience.

PRESERVED
- Walk tracker / Follow mode / GPX export
- Park events and event-watch preferences
- Archie guides
- Park Passport
- Evidence Lens
- Google Analytics G-6ZVETTNBV4
- Production Atlas untouched

ROLLBACK
A7.2 Smooth Map is the immediate rollback candidate. Earlier A7/A7.1 packages remain historical fallbacks.

LIVE ANDROID QA AFTER UPLOAD
- Confirm Explore trails is obvious without opening More.
- Open Trail Explorer > Current trails and confirm only the current category is shown.
- Open Future network and confirm current lines are not presented as part of that view.
- Try Outdoors, Terrain, Satellite and Dark. Confirm map switching preserves parks/trails and pinch zoom remains smooth.
- Tap an interactive trail line if available; confirm Fit trail and Start walk work.
- Test Trails near me only after deliberately granting location.
- Start/Pause/Resume/Finish a trail walk.
- Confirm Reset returns to Outdoors + current trails without erasing Passport, saved walks, Archie progress or event watches.

MAP ATTRIBUTION
Attribution is shown on-map for the active basemap. Outdoors/Dark use OpenFreeMap/OpenMapTiles with OpenStreetMap data. Terrain uses OpenTopoMap with OpenStreetMap and SRTM/Sonny DEM attribution. Satellite uses Esri imagery attribution.
