EPR Parks — A7.5 Fishing Sites
Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback baseline: A7.4 Fishing + Map Polish

WHAT CHANGED
- Expanded Fishing from three fishing-enabled parks to four verified Enid fishing locations.
- Added City of Enid Water Works as an ODWC Close to Home fishing site without counting it as a park.
- Fishing view now reports four fishing locations while the Park Passport remains 19 mapped parks.
- Water Works receives a distinct fish marker when the official City GIS address anchor is available.
- If the City GIS address point cannot load, the Water Works entry still appears in the Fishing list and directions use the official 1400 block W Chestnut address; the app does not invent a pond coordinate.
- Water Works card includes ODWC-published 2.90-acre surface area, 0.36-mile shoreline, and annual Channel Catfish / Hybrid Sunfish stocking information.
- Fishing search, Surprise Me and Fit All understand the non-park Water Works fishing site.
- Preserves A7.4 Dark mode fix, closer zoom, Trail Explorer, walk tracking, events, Archie, Passport and Evidence Lens.

EVIDENCE / CLASSIFICATION
ODWC currently lists four Enid Close to Home fishing locations: Meadowlake Park, Government Springs North Park, Crosslin Park, and City of Enid Water Works at the 1400 block of W Chestnut Ave. The Water Works site is classified by EPR Parks as a fishing site, not a park.

MAP LOCATION
A7.5 asks the City of Enid public GIS Addresses layer for the 1400 W Chestnut address point and uses that as a map anchor only. The UI explicitly says the address point is not a surveyed pond boundary. If the address query fails, no replacement coordinate is guessed.

PRIVACY
No change to the A7 privacy model. Fishing data is public recreation information. No user location is required to browse fishing locations.

ATLAS
Production Atlas is not modified by this package.
