# Design QA: Dashboard Account and Organizer Notifications

## Scope

- References: `codex-clipboard-60c69a37-6df7-447f-87e0-fb52956bd247.png` and `codex-clipboard-7768b9f9-28f5-496f-849c-67c9e1ba69cf.png`
- Routes: authenticated client and organizer dashboard pages
- Updated: account placement and organizer notification access

## Automated verification

- Nuxt production build: passed
- Laravel tests: 7 passed with 28 assertions
- Notification API routes are available to both authenticated client and organizer roles.
- Profile actions use the same compact header control in the client and organizer layouts.
- Organizer notifications use a reusable dropdown with unread count, scrolling, pagination, read/unread actions, and deletion.

## Interaction checks

- A new inquiry notifies organizers whose service tags match its event type.
- Accepting a quotation notifies the organizer who submitted it.
- Opening a notification marks it read and routes to Matching Inquiries or My Offers.
- Individual updates can be marked read/unread or deleted, and older entries can be loaded without expanding the header.

## Visual review

These views require authenticated client and organizer sessions. The isolated Codex in-app browser does not share the authenticated Brave sessions shown in the references and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
