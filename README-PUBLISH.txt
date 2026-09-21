EPR PRODUCTION UPDATE — 2026-09-20

DROP-IN ROOT PATCH
Upload the contents of this folder to the GitHub Pages repository root, preserving folders.

WHAT IT DOES
- Replaces /index.html with the Kaw + Explore Enid homepage refresh.
- Adds /stories/kaw-water-priority/ including Darian audio and Reel.
- Replaces /stories/index.html to feature the new Kaw story.
- Publishes /explore/ as the installable Explore Enid hub.
- Publishes /water/ as the installable Water Explorer.
- Publishes /data/water/ publication-safe JSON used by Water Explorer.
- Adds /assets/images/epr-logo-circle.png for the refreshed homepage/stories index.

INTENTIONALLY UNCHANGED
- /atlas/ is NOT included and must remain exactly as currently deployed.
- Existing Thunderbird, Water Story, Hotel Tax, About, Contact and archive pages are not replaced.
- robots.txt is NOT included, so this patch will not overwrite the production crawler rules.

POST-DEPLOY CHECK
1. Homepage loads and Kaw buttons open the story and Water Explorer.
2. /explore/ loads; More > Install Explore Enid works when browser offers install.
3. /water/ loads all four tabs and records; install prompt appears when supported.
4. /stories/kaw-water-priority/ plays Darian audio and Reel without autoplay.
5. /atlas/ still loads unchanged.
6. /stories/ shows Kaw first.

NOTE
PWA install availability is controlled by the browser/OS. The manifest, service worker, icons, HTTPS paths and standalone display configuration are included.
