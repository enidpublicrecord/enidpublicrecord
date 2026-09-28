EPR Parks Prototype A6 — Parks + Trails + Archie

A6 changes:
- Adds the City of Enid TrailMaster polyline network as a live map layer.
- Trails are ON by default and can be toggled with the walking button.
- Walk filter automatically turns trails on.
- Preserves City GIS status distinctions: current category, design/development, exploration/future.
- Tap a trail for length/status/phase/type fields and public source links.
- Uses the current city/Enid_Transportation TrailMaster layer with the standalone Enid_Trails layer as a public fallback.
- Does NOT guess named master-plan corridor identities when the GIS attributes do not support the name.
- Adds Google Analytics property G-6ZVETTNBV4 supplied for EPR Parks.
- Preserves A5 Archie guides, QR/deep links, 19 mapped park sites, device-local Passport, and A4 map-layout fix.
- Production Atlas is not touched.

Deployment:
Replace the files in /parks/ with this folder. The service-worker cache is bumped to epr-parks-a6. After upload, hard refresh or close/reopen the installed PWA if an old build is still visible.

Trail source:
https://gis.enid.org/server/rest/services/city/Enid_Transportation/MapServer/35
Master plan:
https://www.enid.org/Services/Parks-Recreation/Enid-Master-Trails-Project

Important:
- The live trail feed is public City GIS. If it cannot be reached, the Parks app remains usable and reports that the trail layer is temporarily unavailable.
- Planned/future trail geometry is not presented as an open trail.
- No physical QR sign placement is authorized by this package.
