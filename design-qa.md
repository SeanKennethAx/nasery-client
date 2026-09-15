# Design QA: Notification and Profile Overlay Stacking

## Scope

- Reference: `codex-clipboard-2a372f8b-d75b-4d33-a75e-3b953a0645d1.png`
- Routes: authenticated client and organizer dashboard pages
- Updated: client and organizer notification/profile overlay behavior

## Automated verification

- Nuxt production build: passed
- Opening either profile panel closes the notification dropdown first.
- Both profile backdrops and slide-overs render above header popovers as a fallback.
- Profile panels retain bounded horizontal content and internal scrolling.

## Interaction checks

- Client profile: notification dropdown closes before the slide-over appears.
- Organizer profile: the same close and stacking behavior applies.
- Reopening notifications after closing a profile continues to refresh the list normally.

## Visual review

These views require authenticated client and organizer sessions. The isolated Codex in-app browser does not share the authenticated Brave sessions shown in the references and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
