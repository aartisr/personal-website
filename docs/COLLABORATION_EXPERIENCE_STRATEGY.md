# Collaboration Experience Strategy

## North star

Turn Start Collaboration from a generic contact-form destination into a calm, trustworthy path for mentors, educators, community partners, and technical collaborators. A visitor should be able to decide whether there is a fit, make a thoughtful request in under three minutes, and understand what happens next.

This is not a claim that any design is universally best. The test is practical: clear on a phone, accessible without special knowledge, suitable for a student-led context, protective of privacy, and measurable enough to improve.

## Executive recommendation

Create a dedicated /collaborate page. Point every Start Collaboration CTA there, and retain /support-center for support and policy questions.

The page should provide:

1. A concise fit statement: who can collaborate, what is in scope, and what is not.
2. Four visible, plain-language starting paths: mentor or educator; research or community; technical or open source; speaking or other.
3. A two-step adaptive inquiry: first collect the intent and essentials, then request only path-specific context.
4. An honest post-submission contract: acknowledgement immediately, a response target only if it can be met, and useful resources while the visitor waits.
5. A compact working agreement: no confidential material, appropriate adult or institutional coordination when needed, respectful conduct, and no implied commitment before mutual fit.

The existing single support form is technically sound: it has client validation, a rate-limited endpoint, a honeypot, and webhook forwarding. It is not designed for collaboration. It mixes support and project requests, requires a generic free-text topic, and gives no fit, timing, or next-step information.

## Research method and benchmark set

The 25 references below are a deliberately mixed benchmark set, not a commercial ranking. They were selected for intent routing, trust, contribution onboarding, clarity around next steps, or form accessibility. Adapt the patterns, not their enterprise-level data collection or visual weight.

| # | Reference | Pattern worth adapting |
| --- | --- | --- |
| 1 | [Stripe contact](https://stripe.com/contact) | Route sales, support, press, and developer community before asking for information. |
| 2 | [Stripe sales](https://stripe.com/contact/sales) | Progressive qualification, explicit response expectation, and useful recovery when a form fails. |
| 3 | [Vercel contact](https://vercel.com/contact) | Different routes for support, experts, community, sales, and social channels. |
| 4 | [Vercel sales](https://vercel.com/contact/sales) | Explain the value of the conversation before fields; separate marketing consent. |
| 5 | [Linear contact](https://linear.app/contact) | A concise how-can-we-help chooser and a direct general-contact fallback. |
| 6 | [Linear support](https://linear.app/contact/support) | Ask for relevant context, with attachments available but not mandatory. |
| 7 | [Figma contact](https://www.figma.com/contact/) | Separate product support from sales and ask topic-specific questions. |
| 8 | [Miro sales](https://miro.com/contact/sales/) | Make the likely outcome of the conversation clear before the form. |
| 9 | [Miro support](https://help.miro.com/hc/en-us/articles/360020185799-Contacting-Miro-Support) | Topic and subtopic routing plus resources before escalation. |
| 10 | [Webflow sales](https://webflow.com/enterprise/contact-sales) | Pair a request with relevant expert help or scheduling. |
| 11 | [Canva sales](https://www.canva.com/contact-sales/) | State what to expect: tailored guidance, demonstration, and examples. |
| 12 | [Calendly demo](https://calendly.com/contact/demo) | State the agenda of a conversation up front. |
| 13 | [Calendly partnerships](https://calendly.com/partners/contact) | Set a kind, honest fit boundary: a reply follows if there is a fit. |
| 14 | [Airbnb messaging](https://www.airbnb.com/help/article/3558) | Organize messages by context and make safety, state, and search visible. |
| 15 | [Mozilla contribute](https://www.mozilla.org/en-US/contribute/) | Make technical and non-technical contribution paths equally legitimate. |
| 16 | [MDN community](https://developer.mozilla.org/en-US/community) | Specific contribution modes, beginner entry points, and conversation channels. |
| 17 | [GitLab contribute](https://about.gitlab.com/community/contribute/) | Combine onboarding, help, contribution modes, guidance, and conduct. |
| 18 | [GitLab community](https://about.gitlab.com/community/) | Let people choose contribution, learning, events, chat, programs, or support. |
| 19 | [Khan Academy volunteering](https://support.khanacademy.org/hc/en-us/articles/202260334-How-can-I-volunteer-at-Khan-Academy) | Treat sharing, coaching, translation, moderation, and stories as distinct help. |
| 20 | [Atlassian community](https://www.atlassian.com/community) | Give three simple ways to start and reveal richer options afterward. |
| 21 | [Salesforce Trailblazer groups](https://trailhead.salesforce.com/content/learn/modules/trailblazer-community-basics/meet-trailblazers-like-you) | Browse participation by shared interest, role, and region before commitment. |
| 22 | [GOV.UK validation](https://design-system.service.gov.uk/patterns/validation/) | Give specific recovery guidance ahead of clever client-side validation. |
| 23 | [W3C forms tutorial](https://www.w3.org/WAI/tutorials/forms/) | Use short forms, labels, grouped controls, feedback, and progress. |
| 24 | [W3C labels guidance](https://www.w3.org/WAI/tutorials/forms/labels/) | Ensure each control has a clear visible label. |
| 25 | [W3C clear labels pattern](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o4p06-clear-labels/) | Favor familiar, adjacent, step-by-step wording for cognitive accessibility. |

### Findings

- Route before collecting. Stripe, Vercel, Linear, and GitLab reduce noise by letting people state their purpose first.
- Show the value and process. Canva, Webflow, Miro, and Calendly make the next interaction tangible.
- Treat contribution broadly. Mozilla, MDN, Khan Academy, Atlassian, Salesforce, and GitLab make mentoring, research, feedback, design, code, and documentation valid paths.
- Make fit boundaries clear. Calendly is a good model: no false promise and no cold rejection.
- Make submission recoverable. GOV.UK and W3C support visible labels, specific errors, preserved values, keyboard operation, and a clear success state.

## Experience architecture

    Any Start Collaboration CTA
             |
             v
    /collaborate: fit statement + choose a path
             |
             +-- Mentor or educator ------> mentoring inquiry
             +-- Research or community --> research or project proposal
             +-- Technical or open source -> contribution or partnership
             +-- Speaking or other -------> event, press, or general inquiry
             |
             v
    Adaptive two-step form
             |
             v
    Acknowledgement + expected next step + useful reading
             |
             v
    Webhook or inbox triage with owner and response-status record

## Page and copy specification

### Above the fold

- Eyebrow: Collaboration
- Heading: Build something useful, with care.
- Intro: Aarti welcomes thoughtful academic, community, and technical conversations. Start with the kind of collaboration you have in mind; the next questions will stay focused.
- Trust line: No confidential information needed. A conversation begins only after mutual fit is confirmed.

Render these four selectable cards as native buttons:

| Path | Description |
| --- | --- |
| Mentor or educator | Share perspective, feedback, learning opportunities, or research guidance. |
| Research or community partner | Explore a local question, evidence need, or practical pilot. |
| Technical or open-source collaborator | Discuss code, design, documentation, testing, or an existing project. |
| Speaking, press, or another idea | For events, interviews, introductions, or a proposal that does not fit above. |

On desktop use a two-by-two grid. On mobile use one column and at least 48px tap targets. Selection must update the visible form heading and a polite live region without navigating away.

### Form: Step 1, shared essentials

| Field | Control | Required | Helper |
| --- | --- | --- | --- |
| Your name | text | Yes | How should we address you? |
| Email | email | Yes | A reply address for this conversation. |
| You are reaching out as | radio group | Yes | Mentor/educator; community organization; student; technical collaborator; other. |
| What would make this conversation useful? | textarea | Yes | A few sentences are enough. Do not include private, medical, or confidential information. |

Make the textarea label adapt to selected path:

- Mentor: What perspective, question, or learning opportunity would you like to discuss?
- Research/community: What community question, audience, or outcome are you exploring?
- Technical: Which project or technical area is relevant, and what contribution or partnership do you have in mind?
- Other: What is the purpose of your note, and why might it be a good fit?

### Form: Step 2, only when useful

Step 2 is optional except for a single acknowledgement checkbox.

| Path | Optional fields |
| --- | --- |
| Mentor or educator | Subject area; preferred way to connect; institution or program. |
| Research or community | Related portfolio project; intended audience; desired timeline; public link. |
| Technical or open source | Relevant repository; contribution type; technical skills; public work link. |
| Speaking or other | Organization/event; date or decision deadline; audience; public link. |

Required acknowledgement:

I understand that submitting this note starts an inquiry, not a commitment, and I will not include confidential or sensitive personal information.

Do not collect a phone number by default. Do not require a website, school, organization, attachment, meeting, or marketing consent. Those are not necessary to decide whether a first reply is worthwhile.

## Accessibility and interaction requirements

- Use visible label elements associated to unique IDs. Placeholder text is an example, never a label.
- Group radio controls with fieldset and legend.
- Preserve valid values after errors. Put an error summary above the form and link every error to its field.
- Validate on submit first. Add validation on blur only if testing shows it helps.
- Move focus to the error summary after a failed submit, and preserve keyboard order.
- Keep draft input only in sessionStorage and give people a Clear draft action. Never send it to analytics.
- Disable double-submit. If downstream delivery fails, say so honestly and provide retry and an alternate contact route.
- Respect reduced motion. Do not auto-advance focus or scroll unexpectedly.

## Success state

The success state should answer the visitor’s three immediate questions.

Heading: Your inquiry is on its way.

Body: Thank you for the context. The next step is a fit review, not an automatic commitment. If a reply is possible, it will use the email you provided.

What happens next:

1. Your note is reviewed for fit, safeguarding, and a clear next step.
2. If there is a fit, the response will suggest a focused conversation or an appropriate resource.
3. If the request is outside scope, you may receive a brief redirect or no response; this is not a judgment of the value of the idea.

Only promise a numerical response time after an owner agrees they can meet it. Show two path-relevant resources in the success state, such as a project, framework PDF, research note, or GitHub profile.

## Safeguarding, privacy, and boundaries

The site represents a student, so this is more than standard lead capture.

- Publish a short Collaboration Working Agreement beside the form and link the full policy.
- State: no confidential information; no medical advice or emergency requests; no financial commitments; and no private meeting without appropriate adult or institutional coordination where needed.
- Add a clear urgent-help alternative appropriate to the audience.
- Ask for an adult or institutional contact during follow-up, not as a barrier to a first inquiry.
- Add an inclusive code-of-conduct link.
- Exclude free-text answers, email addresses, names, IPs, and user agents from PostHog, Clarity, logs, and session replay.

Responsible adult and legal review is required before publishing policy wording. This is a UX plan, not legal advice.

## Implementation roadmap

### Phase 0: operating model (1–2 days)

1. Name the inbound owner and set the response standard that can actually be met.
2. Agree the four supported paths, scope exclusions, and alternative routes.
3. Decide the webhook destination and retention/deletion policy.
4. Define the small, privacy-safe event list. Never capture field values.

### Phase 1: content and architecture (2–3 days)

1. Add content/pages/collaborate.json.
2. Create a new CollaborationIntake Puck block; do not overload ContactForm.
3. Route all Start Collaboration CTAs to /collaborate, and retain /support-center for general support.
4. Add fit guidance, working agreement, and before-you-send content.
5. Add a status statement only if it is accurate.

### Phase 2: interface (3–5 days)

1. Build a server-rendered shell and a small client CollaborationIntake component.
2. Keep paths declarative: ID, title, description, prompt, optional fields, success resources.
3. Use native controls and component-local CSS. Avoid a large form framework unless it improves accessibility or bundle cost.
4. Allow only an allowlisted query preselection, for example /collaborate?path=technical.
5. Add error summary, helper/error relationships, focus management, and session draft handling.

### Phase 3: server contract and reliability (2–4 days)

1. Add /api/collaboration with a fixed server schema. Do not accept the client field schema as the generic endpoint currently does.
2. Validate enums, trim input, apply field-specific length limits, and reject unexpected keys.
3. Retain the honeypot and rate limit; add request IDs.
4. Add fetch timeout, safe retryable errors, and HMAC webhook signing when supported.
5. Do not expose detailed webhook failures to the browser.
6. Add tests for valid requests, acknowledgement, enums, rate limit, timeout, and non-2xx webhook responses.

### Phase 4: measurement and iteration

Capture only these non-sensitive events:

| Event | Safe properties |
| --- | --- |
| collaboration_page_viewed | CTA source |
| collaboration_path_selected | path ID |
| collaboration_step_viewed | path ID, step number |
| collaboration_validation_failed | field name, error category only |
| collaboration_submitted | path ID, role, optional-field count |
| collaboration_delivery_failed | path ID, safe error category |
| collaboration_resource_opened | path ID, resource ID |

Track operational metrics outside product analytics: inquiry-to-first-response time, inquiries with a next step, safely out-of-scope requests, confirmed collaborations by path, response-standard attainment, and manually coded form-confusion reasons.

## Acceptance criteria

### Experience

- A visitor can choose a path, understand fit, and submit a basic inquiry in under three minutes on a phone.
- Initial entry requires no more than four visitor-entered fields plus acknowledgement.
- Collaboration CTAs route to /collaborate; support CTAs route to /support-center.
- No flow forces a meeting or requires a phone number.

### Accessibility

- Keyboard-only completion works end to end.
- Inputs have visible, associated labels and instructions before needed.
- Validation has error summary, field linkage, preserved values, and predictable focus.
- The finished experience passes WCAG 2.2 AA checks for contrast, focus, target size, names, labels, status messages, and error identification.

### Reliability and performance

- Fixed server schema rejects unsupported data.
- The API returns a request ID and an honest failure response when delivery fails.
- Analytics and replay exclude form answers.
- The page server-renders; only chooser/form interaction hydrates.
- Mobile Lighthouse target: Performance at least 95, Accessibility 100, Best Practices 100, SEO 100 on the deployed route.

## Release sequence

1. Ship fit content, path cards, and working agreement with the existing endpoint.
2. Add adaptive fields, request IDs, and fixed-schema server tests.
3. Add success resources and an operational response workflow.
4. Add privacy-safe measurement after confirming field exclusion.
5. Conduct five moderated usability sessions: educator, student, community partner, technical collaborator, and keyboard or screen-reader user.
6. Improve the next release from observed friction, not aesthetic preference alone.

## Definition of done

The collaboration experience is complete when it gives every serious visitor a respectful starting point, makes non-fit clear and safe, protects the submitter’s information, and produces an operationally useful inquiry. A beautiful form alone is not the collaboration product; the expectation-setting, follow-through, and safety boundaries are.
