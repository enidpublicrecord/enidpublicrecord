EPR Parks Prototype A4 — hosted mobile map fix

Purpose:
- Preserve the A3 interface and park data.
- Fix the fragmented 256x256 tile squares seen on the hosted /parks/ page.
- Embed the critical Leaflet positioning/layout CSS directly in index.html.
- Keep OSM primary + Esri fallback from A3.
- Bump the service-worker cache to epr-parks-a4.
- Production Atlas is not touched.

Deployment:
Replace the current files in /parks/ with the contents of this folder.
Then load https://enidpublicrecord.com/parks/ and refresh twice if the old service worker is still active.
