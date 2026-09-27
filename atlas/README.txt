EPR Parks Prototype A5 — Archie Digital Guide

A5 changes:
- Adds Archie’s Guide as a digital-first self-guided experience.
- Adds device speech narration with selectable English device voices.
- Adds permanent deep links: /parks/?guide=<park>&stop=<NN>.
- Adds QR generation for each guide stop; physical signage is NOT required or assumed authorized.
- Adds 19 EPR-mapped park sites to the prototype Passport/map; this is a mapped-app inventory, not a claim that Enid has only 19 parks/recreation areas.
- Guide beta currently available at Meadowlake, Crosslin, Government Springs North, and Weldon.
- Preserves A4 self-contained Leaflet map-layout fix, OSM primary map, and Esri fallback.
- Production Atlas is not touched.

Deployment:
Replace the files in /parks/ with this folder. Refresh twice if the prior service worker remains active.

Important:
No physical QR sign placement is authorized by this package. QR codes are for digital/print use unless the property owner later grants permission.
