# Design QA: Client Header Notifications

## Scope

- Reference: `codex-clipboard-f10551a7-f33a-4378-ae7b-96d455330e04.png`
- Routes: authenticated client dashboard pages
- Updated: header status area and client notification placement

## Automated verification

- Nuxt production build: passed
- The client System Online badge is removed.
- The reusable notification dropdown now sits immediately beside the client profile control.
- The old full-width notification section is removed from My Events.
- Notifications retain unread counts, scrolling, pagination, read/unread actions, deletion, and navigation to My Events.

## Interaction checks

- Opening the bell refreshes the latest notifications.
- Opening a client notification marks it read and keeps the client in the My Events workflow.
- Individual updates can be marked read/unread or deleted.
- Older notifications remain accessible through the compact dropdown.

## Visual review

These views require an authenticated client session. The isolated Codex in-app browser does not share the authenticated Brave session shown in the reference and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
