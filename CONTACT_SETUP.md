# Contact form

The RU/EN/KY contact dialog posts JSON to `/api/contact`. The server sends plain-text email through Resend to the fixed recipient `lfc@legacyfidelity.com`; Reply-To is the validated visitor email. No browser email application or external form page is required.

Required production configuration:
- `RESEND_API_KEY`: sending-only key for a verified sending domain, stored as a sensitive Vercel environment variable.
- `CONTACT_FROM_EMAIL`: verified sender address with the Chronograph display name.

Never put keys in frontend files or the repository. The Concord House key is restricted to its own domain and has not been copied.

Before release, configure sending, deploy, and verify a clearly identified test message reaches the owner. A Resend API acceptance is not proof of inbox delivery.

Validation covers required fields, email shape, body and field lengths, JSON content type, same-origin browser requests, and a hidden bot-trap field. These checks are not comprehensive bot prevention. The handler returns an error when configuration or delivery is unavailable; the UI retains the visitor's text. API and UI tests use mocks and send no email.

Tests: `node scripts/support/contact-test.cjs`, `node scripts/support/contact-ui-test.cjs`, and the full `node scripts/release-check.cjs` build.
