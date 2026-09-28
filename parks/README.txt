EPR Parks — A7 Outdoor Mode

PURPOSE
A7 is the usability + outdoors release candidate. It keeps the map visually open while moving advanced tools behind context-sensitive controls.

NEW IN A7
- Reset, Layers, Legend, Help/Install and More tools patterned after useful Atlas controls.
- Park-linked Events feed with official source links and on-map event badges.
- Local event-watch preferences; app-open change notice foundation. Background push requires a future EPR notification service.
- Privacy-first Walk tracker: distance, elapsed time, approximate pace, GPS breadcrumb route, pause/resume, follow mode, finish summary, local save, GPX export and summary sharing.
- Health/Fitness-ready walk record schema for later native Apple Health / Android Health Connect integration. The web build does not read health history.
- Quieter visible controls: Walk, Trails and Archie stay on the map; Layers/Legend/Reset/Evidence/Help live under More.
- Trail status layer switches: current, design/development and future/exploration.
- Google Analytics G-6ZVETTNBV4 retained. No GPS coordinates or search text are sent to analytics by A7 code.

EVENT DATA
The bundled events.public.json is publication-safe and source-linked. It is a snapshot checked 2026-09-27. Official sources control if schedules change.

TRAIL DATA
A7 continues to refresh City TrailMaster geometry directly from the public City GIS at runtime. This is a known transition state. The next infrastructure step is an EPR-controlled publication-safe trail feed; A7 does not claim that migration is complete.

PRIVACY
Passport, Archie progress, watched parks and saved walks use local device storage. Walk GPS route points are not sent to Google Analytics. Users choose whether to save or export a completed route.

ROLLBACK
A6.1 remains the known-good immediate rollback baseline. A5 remains the pre-trails rollback baseline.

ATLAS
Production Atlas is not modified by this package.
