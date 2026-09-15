# Design QA: Post Event Inquiry Location Map

## Scope

- Reference: `codex-clipboard-e29bfbf4-fa84-4bf2-83f6-9b76a0ee47d9.png`
- Route: `/client/post-event`
- Updated: selected-location map rendering and fallback behavior

## Automated verification

- Nuxt production build: passed
- A location selection initializes one Leaflet map after nearby organizers load.
- Replaced map containers are detected and safely reinitialized.
- A branded LocationIQ static map is shown if interactive-map initialization fails.

## Interaction checks

- Select a LocationIQ result and confirm the venue map becomes visible.
- Change the venue and confirm the map recenters without an initialization error.
- Confirm the selected venue remains visible through the static fallback if Leaflet cannot initialize.

## Visual review

These views require authenticated client and organizer sessions. The isolated Codex in-app browser does not share the authenticated Brave sessions shown in the references and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
