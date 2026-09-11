# Public organizer directory

## Routes

- `/` and `/organizers`: public directory with search, specialty and location filters, and sorting.
- `/organizers/:slug`: public organizer overview, specialties, and completed events. Unknown slugs return 404.
- `/client/post-event`: existing protected inquiry form. Guests are sent to `/login?redirect=/client/post-event`.

The inquiry destination survives switching between login and registration. Registration from this flow defaults to a client account. Successful client login continues to the inquiry form; organizer login retains its existing dashboard destination. Only the exact inquiry path is accepted as a redirect.

## Data and scope

The directory loads `GET /api/organizers`, and each profile loads `GET /api/organizers/{slug-id}`. Both endpoints are public. The profile types live in `app/types/portfolio.ts`, and the API calls live in `app/services/organizerPortfolioService.ts`.

Listings use organizer profile data maintained through the existing organizer profile endpoint. Portfolio cards are generated from events whose status is `completed`. Private contact details, client information, guest lists, payments, revenues, and events with other statuses are excluded from the public response. Visible review counts and averages are included; hidden reviews are excluded.

The current schema stores services as the organizer’s `specialties` array, so the public profile displays those values under “Services & expertise.” Decorative covers remain generated UI artwork because the schema has no portfolio image storage yet.

Posting an inquiry uses the existing matching/offers workflow. Viewing a portfolio does not select or book that organizer.

## Verification

With Node 24 active in this directory:

```sh
node --test tests/public-browsing.test.mjs
npm run build
npm run dev -- --port 3100
```

From `api`:

```sh
php artisan test --compact tests/Feature/PublicOrganizerDirectoryTest.php
```

Tests execute the route guards and the login page script using an isolated auth service. They cover guest browsing, protected inquiry access, email and phone return destinations, organizer routing, and rejection of untrusted redirect inputs. No account creation or live login is performed.

Manual browser checks: combined filters and empty state, clearing filters, portfolio-project sorting, portfolio navigation and project expansion, guest inquiry redirect, registration navigation, and mobile directory/profile layouts.
