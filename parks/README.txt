EPR Parks — A7.14 Trail Reliability

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.13 Final Dark

Trail reliability changes:
- City-rendered trail tiles are shown immediately instead of waiting for the interactive geometry query.
- Interactive trail geometry loads in the background and replaces the rendered tiles when successful.
- Both City TrailMaster endpoints are attempted concurrently by JSONP and CORS fetch; the first valid geometry result wins.
- JSONP/direct-fetch timeouts are shorter so failed geometry attempts do not hang the app.
- Panning/zooming keeps a larger trail-tile buffer and updates tiles during movement.
- If interactive geometry is unavailable, the user still gets a usable trail map instead of “Trails not loaded.”
- Trail Explorer explains whether tap-for-details is currently available.
- Existing green / design gold / future red-not-usable status treatment remains unchanged.

A future EPR-controlled publication-safe trail feed is still the preferred long-term architecture.
Production Atlas is not changed by this patch.
