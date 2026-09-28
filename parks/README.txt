EPR Parks — A7.18 Course Map Discovery
Date: 2026-09-28
Rollback: A7.17 NWOSU Course Map

Android phone-test fix:
- A7.17 correctly placed the NWOSU-NOC course marker, but the 18-hole layout was hidden behind the course card.
- A7.18 makes the course map obvious without putting permanent clutter across Parks.
- The NWOSU-NOC marker now has a small “tap for course map” label.
- Tapping that marker opens the 18-hole course map directly.
- The course-map screen is explicitly labeled “18-hole course map.”
- If the course card is opened, “18-hole course map” is the primary action.
- Scorekeeping and current-hole highlighting remain connected to the map.

Accuracy / ownership boundaries are unchanged:
- The hole layout is an EPR reference schematic, not exact GPS tee/basket coordinates.
- NWOSU-NOC remains campus recreation, park_id=null, city_park_inventory=false.
- It is not counted among the 19 City parks and is not promoted into the City asset/property layer.
