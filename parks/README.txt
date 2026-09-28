EPR Parks — A7.16 NWOSU Course Fix

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.15 Disc Golf + Scorekeeper

Fix:
- NWOSU-NOC Disc Golf Course now always appears in Disc Golf mode.
- It uses a supported course-location anchor rather than depending on the City GIS address lookup.
- The course remains park_id=null and is not added to the 19-park inventory.
- The UI explicitly identifies it as a campus recreation course, not a City park/property asset.
- The app does not use the course-location anchor as ownership evidence.
- Meadowlake remains the City park-based disc golf course.
- Scorekeeping, saved rounds, trail reliability, Fishing, Events, Archie, Passport, Walk tracker and Dark mode are preserved.

Data boundary:
NWOSU-NOC course existence/location is recreation data.
It is not promoted into EPR's City asset/property layer.
Exact parcel ownership is not inferred from the map anchor.
