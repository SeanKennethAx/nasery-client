# Design QA: Client and Organizer Header Notifications

## Scope

- References: `codex-clipboard-f10551a7-f33a-4378-ae7b-96d455330e04.png` and `codex-clipboard-e00549f8-31ae-4ae3-9c11-395acab179ef.png`
- Routes: authenticated client and organizer dashboard pages
- Updated: shared header status area and notification placement

## Automated verification

- Nuxt production build: passed
- The System Online badge is removed from both portal headers.
- The reusable notification dropdown now sits immediately beside each profile control.
- The old full-width notification section is removed from My Events.
- Notifications retain unread counts, scrolling, pagination, read/unread actions, deletion, and navigation to My Events.

## Interaction checks

- Opening the bell refreshes the latest notifications.
- Opening a client notification marks it read and keeps the client in the My Events workflow.
- Individual updates can be marked read/unread or deleted.
- Older notifications remain accessible through the compact dropdown.

## Visual review

These views require authenticated client and organizer sessions. The isolated Codex in-app browser does not share the authenticated Brave sessions shown in the references and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
