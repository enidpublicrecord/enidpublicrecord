EPR Parks — A7.15 Disc Golf + Scorekeeper

Release class: PUBLIC CANDIDATE
Date: 2026-09-28
Rollback: A7.14 Trail Reliability

Disc Golf:
- Adds Disc Golf as a recreation filter without adding permanent map clutter.
- Adds Meadowlake Disc Golf Course and NWOSU-NOC Disc Golf Course.
- Course-level facts live in publication-safe disc-golf.public.json.
- Meadowlake uses the existing park/course anchor.
- NWOSU-NOC resolves 2929 E Randolph against the City GIS address-point service when available.
- Includes a future-ready tee/basket/hole-line renderer. Individual hole geometry/par/distance remain blank until verified.

Scorekeeper:
- 1–6 players.
- Hole-by-hole +/- stroke controls.
- Previous / next hole, full 18-hole scorecard and running totals.
- Active round survives page reload.
- Full or partial round finish.
- Saved-round history stored only on device.
- Full 18-hole results may show final score relative to the source-supported course total par of 54.
- Optional share summary.
- Meadowlake can be manually added to Park Passport after a round.
- Names and scores are not sent to analytics.

Interaction:
- Walk tracking and Disc Golf scorekeeping do not run simultaneously in this PWA build.

Preserved:
- A7.14 trail reliability.
- A7.13 approved Dark treatment.
- Fishing, events, Archie, Passport, GPX, Evidence Lens and privacy behavior.
- Production Atlas is untouched.
