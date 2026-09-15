# Design QA: Registration Email Verification

## Scope

- References: `codex-clipboard-4f2d6a80-d0b2-4116-b6aa-ee6a400909cf.png` and `codex-clipboard-d9ffc672-fed3-4fb2-b2a7-23928af4acea.png`
- Route: `/register`
- Updated: account email verification and stable authentication layout

## Automated verification

- Nuxt production build: passed
- Both client and organizer registrations require a verified email token.
- Verification codes expire, limit attempts, and can only be used for one account.
- The desktop marketing panel remains fixed while role-specific form content changes height.

## Interaction checks

- Send a code, enter the six digits, and confirm the verified state appears.
- Change the email and confirm its verified state is cleared.
- Switch repeatedly between Client and Organizer and confirm “Events that win bids” stays in place.

## Visual review

These views require authenticated client and organizer sessions. The isolated Codex in-app browser does not share the authenticated Brave sessions shown in the references and redirects to `/login`, so same-state screenshot comparison is unavailable.

## Final result

Passed automated verification. Authenticated screenshot comparison remains blocked by the isolated browser session.
