# Design QA: Organizer Offer Confirmation

## Scope

- Reference: `codex-clipboard-b6c3d16b-114f-4efc-8f87-90daadc17496.png`
- Route: `/organizer/inquiries/match-inquiries`
- Updated: final confirmation before an organizer submits an offer

## Automated verification

- Nuxt production build: passed
- The slide-over validates the selected inquiry, session, and quotation amount before opening the confirmation.
- The confirmation uses `app/components/forms/ConfirmationModal.vue` for the same structure, color palette, loading state, and explicit choices as other confirmation flows.
- Confirming uses the existing quotation endpoint and error handling; API errors return the organizer to the slide-over.
- The review summary includes the inquiry, formatted amount, package, and timeline.

## Interaction checks

- Submit Offer with invalid amount: stay in the form and show the inline validation error.
- Submit Offer with valid data: show the review confirmation.
- Review offer: close the confirmation and preserve every entered field.
- Yes, submit offer: lock the modal while submitting, then refresh matching inquiries and retain the existing success feedback.
- API failure: close the confirmation and show the backend message in the slide-over.

## Visual review

The route requires an authenticated organizer session. The isolated Codex in-app browser does not share the authenticated Brave session shown in the reference and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
