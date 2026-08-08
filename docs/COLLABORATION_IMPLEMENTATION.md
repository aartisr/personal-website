# Collaboration implementation guide

## What is shipped

- The collaborate route is CMS-editable and uses the reusable
  CollaborationIntake shared-ui block.
- POST /api/collaboration accepts a fixed inquiry contract instead of client
  supplied form schemas.
- The flow has four configurable paths, a two-step form, private session-only
  drafts, visible recovery errors, a working agreement, and an honest success
  state.
- Start Collaboration actions now lead to the collaborate route; the Support
  Center remains the general support destination.

## Delivery setup

Set RESEND_API_KEY and COLLABORATION_FROM_EMAIL to use Resend as the preferred
production delivery path. Resend sends to info@ai-aarti.com by default and
uses the submitter email as Reply-To. The sender domain must be verified in
Resend. COLLABORATION_WEBHOOK_URL and SUPPORT_WEBHOOK_URL remain fallbacks.
When no delivery path is configured, the API returns an honest
delivery-unavailable response; it never claims that an inquiry was delivered.

The receiving workflow should retain only the information needed to decide
fit, keep an owner and response status, and avoid forwarding personal details
to analytics, session replay, or untrusted services.

## Safe extension points

Edit the CollaborationIntake block in content/pages/collaborate.json to change
paths, prompts, optional details, and success resources. Keep path IDs within
mentor, community, technical, and other unless the server allowlist is updated
in the same change.

The browser component never emits field values to analytics. If product events
are added later, limit them to path ID, step number, role, optional-field
count, and safe error category.

## Release checklist

1. Assign an inbox owner and an attainable response standard.
2. Configure and test the webhook with a non-sensitive sample inquiry.
3. Confirm the working-agreement wording with the responsible adult and
   applicable institutional policy owner.
4. Test keyboard-only completion, a small-screen submission, error recovery,
   rate limiting, and unavailable-webhook behavior.
5. Review operational outcomes before changing questions or adding collection.
