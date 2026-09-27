EPR Parks Prototype A3 — basemap repair

Changes from A2:
- Removes CARTO Voyager dependency after CARTO's 2026 API-key requirement.
- Uses OpenStreetMap standard raster tiles as the primary temporary prototype basemap.
- Uses Esri World Street Map as a backup if repeated tile errors occur.
- Bumps the PWA cache from epr-parks-a2 to epr-parks-a3.
- Service worker now uses network-first navigation so future index updates do not get stuck behind an old cached page.
- No changes to production EPR Atlas.

Deploy: replace the files in /parks/ with this package's contents, preserving the folder-relative paths.
