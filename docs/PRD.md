PRODUCT
REQUIREMENTS DOCUMENT

# Indian Wedding
Management Platform

A shared workspace for planning, coordinating, and running an Indian wedding.

|  |

| --- |

| Document field | Value |

| --- | --- |

| Document status | PRD v1.0 — product scope baseline for review |

| Prepared | 13 October 2026 |

| Primary customer | Couples and families planning a wedding |

| Initial wedding size | Approximately 150–500 guests |

| Initial market | One city or region; specific launch region TBD |

| Initial platform | Responsive web application |

| Primary validation goal | Validate the product with real wedding planning before broad expansion |

| Scope principle The first release should connect the core planning workflows. It should not attempt to build a vendor marketplace, native mobile apps, payment processing, a custom livestream platform, or advanced automation. |

| --- |

Working name only. Product branding and final technical stack have not been selected.

## Contents

- 1. Executive summary

- 2. Problem statement and product vision

- 3. Goals, non-goals, and principles

- 4. Target users and roles

- 5. Confirmed decisions and assumptions

- 6. Product structure and release scope

- 7. Functional requirements

- 8. Core workflows

- 9. Business rules and data concepts

- 10. Non-functional requirements

- 11. Success metrics and validation plan

- 12. Release plan

- 13. Risks and mitigations

- 14. Dependencies and open decisions

- 15. MVP acceptance checklist

| How to read this document “Must” describes a first-release requirement. “Later” identifies a deliberately deferred capability. Items labelled “Assumption / confirm” are recommended defaults that still require explicit product confirmation before they become immutable requirements. |

| --- |

## 1. Executive summary

The Indian Wedding Management Platform is a responsive, web-first product for couples and families planning a wedding of roughly 150–500 guests. It brings the wedding’s events, tasks, people, guest invitations, RSVPs, vendor commitments, and expenses into one shared workspace.

The product serves two connected experiences: (1) an authenticated workspace for the couple, family collaborators, planners, and selected vendors; and (2) a guest-facing, mobile-friendly invitation page that can be opened from a WhatsApp link without requiring a guest account.

The first release focuses on complete coordination rather than maximum feature count. The central product loop is: create a wedding → define events → assign work → invite guests by event → collect RSVPs → manage vendors and costs → monitor progress from one dashboard.

| Product hypothesis Families coordinating a multi-event Indian wedding will find a shared, event-aware workspace more useful than juggling disconnected chat groups, spreadsheets, and separate invitation tools. This hypothesis must be validated with real users. |

| --- |

## 2. Problem statement and product vision

### 2.1 Problem statement

Indian weddings can involve several functions, multiple venues, hundreds of invitees, many vendors, and planning responsibilities shared across two families. Information can become scattered across messaging apps, phone calls, spreadsheets, notes, and documents. That fragmentation makes it difficult to answer basic questions reliably: what is next, who owns it, how many people are attending each function, what has been paid, and what remains unresolved.

### 2.2 Product vision

| One wedding. One shared plan. Everyone coordinated. Give couples and families one place to organise the wedding while allowing guests to receive relevant invitations and respond with minimal friction. |

| --- |

### 2.3 Positioning

Position the product as an Indian Wedding Management Platform: a coordination workspace for planning and executing a wedding, not a vendor-discovery marketplace. The intended differentiation is connected family collaboration, event-specific planning, guest management, and clear visibility across the whole wedding.

### 2.4 Core user promise

Know what is happening, who is responsible, what it costs, and who needs to attend each event.

## 3. Goals, non-goals, and product principles

### 3.1 Product goals

- Enable a couple to create one wedding workspace containing multiple functions.

- Let authorised family members and planners share responsibility without giving everyone unrestricted access.

- Make tasks, event schedules, guest attendance, vendor commitments, and expenses visible together.

- Keep guest management lightweight: individual guest records, event-wise invitations, and straightforward RSVP statuses.

- Let guests open a personalised invitation link and respond without registering for an account.

- Validate the core workflow in a small number of real weddings before investing in later-stage features.

### 3.2 Non-goals for the first release

- Vendor discovery, comparison, marketplace listings, or booking transactions.

- Native Android or iOS applications.

- In-app payment processing, banking integrations, or money transfers.

- Custom livestreaming infrastructure, video hosting, or streaming delivery.

- AI wedding assistant, automatic scheduling, or advanced seating optimisation.

- Hotel/travel booking engine or full accommodation and transport operations.

- Guest social network or complex invitation-card design/download studio.

### 3.3 Product principles

| Principle | Implication |

| --- | --- |

| Simple by default | A family should be able to add guests, create tasks, and share an invitation without a complicated setup process. |

| Wedding-wide and event-specific | Every function can be managed separately, while the dashboard combines the whole wedding. |

| Individual guest invitations | The default invitation unit is a guest, not an entire household. Event participation and RSVPs are tracked per guest and per event. |

| Guests do not need accounts | A guest uses a secure, scoped link to see their invitation and submit an RSVP. |

| Permission-aware collaboration | Family members, planners, and vendors only see the wedding information needed for their role. |

| One source of truth | Dashboard figures are derived from the underlying event, guest, task, and expense records. |

| Build for validation | Defer expensive or complex capabilities until real users show that they are valuable. |

## 4. Target users and roles

### 4.1 Primary audience

Couples and families organising a wedding with approximately 150–500 guests. The initial launch is intended for one city or region. The exact region is not yet selected.

### 4.2 Roles

| Role | Core responsibilities | Default access boundary |

| --- | --- | --- |

| Wedding owner | Creates the workspace, controls settings, invites members, oversees the full wedding. | Full workspace administration; sensitive actions should be auditable. |

| Family administrator | Manages assigned events, guest lists, tasks, and approved expenses. | Only modules/events and records permitted by the owner. |

| Planner / coordinator | Coordinates schedule, tasks, vendors, and on-the-day details. | Operational information required for assigned work; budget access is not automatic. |

| Selected vendor | Views relevant event information and updates assigned tasks or deliverables. | Only assigned events and explicitly shared records. |

| Guest | Views invitation details and responds to event invitations. | No account; scoped invitation link; no access to the guest directory or workspace. |

| Permission design note Role names are a starting point. Access checks must be enforced by the server for each request and record; hiding a button in the interface is not sufficient protection. |

| --- |

### 4.3 Primary use cases

- The couple sets up the wedding and creates Haldi, Mehendi, Wedding, Reception, or custom events.

- A family member takes ownership of assigned planning tasks and deadlines.

- An organiser adds or imports individual guests and selects which events each guest is invited to.

- A guest opens a WhatsApp-shared invitation link and accepts or declines a specific event.

- The couple reviews event headcounts, unpaid vendor balances, overdue tasks, and upcoming milestones.

## 5. Confirmed decisions and assumptions

### 5.1 Confirmed product direction

| Decision | Current direction |

| --- | --- |

| Primary customer | Couples and families. |

| Initial wedding size | Approximately 150–500 guests. |

| Initial market | One city or region; city is TBD. |

| Core problem | Complete wedding coordination across connected workflows. |

| Platform | Web application first, responsive for mobile use. |

| Events | Support both event-specific management and a wedding-wide overview. |

| User groups | Couples/families, planners, selected vendors, and guests. |

| Vendor model | Manage vendors already selected by the family; no marketplace in MVP. |

| Guest invitation default | Individual invitations first; do not default to one family-wide invitation. |

| Invitation experience | Personalised digital invitation page with couple names, event details, message, and RSVP button. |

| Guest access | Guests open invitation links and RSVP without creating an account. |

| Invitation sharing | WhatsApp-compatible shareable links; automated bulk messaging is not required for the first release. |

| Invitation scope | Invitation card image/PDF download is deferred. |

| Media features | Photo gallery and livestreaming are desired but phased after the core planning workflow. |

| Business objective | First-hand validation with real wedding planning before broad launch. |

### 5.2 Recommended defaults that still need confirmation

The following are pragmatic working assumptions for requirements planning. They are not treated as explicit user approvals.

| Item | Recommended MVP assumption | Status |

| --- | --- | --- |

| Language | English-first, with localisation kept possible. | Confirm |

| Notifications | In-app and email notifications; WhatsApp links shared manually. | Confirm |

| Vendor portal | Selected vendors can view assigned event details and update assigned tasks. | Confirm |

| Website privacy | Wedding information can be shared by link; RSVP actions and guest-specific data remain scoped to the invitee. | Confirm details |

| Expense responsibility | Record expense amount, payer, due/paid status, and optionally which family side is responsible. | Confirm detail |

| Accommodation/transport | Defer full logistics management in MVP. | Confirm |

| Photo gallery and livestream | After the first planning pilot; use external services for basic streaming links. | Confirm phase |

| Currency and local settings | INR and Indian date/phone defaults are reasonable, but preferences should not be hard-coded into data logic. | Confirm |

## 6. Product structure and release scope

### 6.1 Main navigation

| Area | Purpose | Release |

| --- | --- | --- |

| Overview | Wedding progress, upcoming events, tasks, RSVP summary, budget snapshot, alerts. | MVP |

| Events | Create and manage functions, dates, venues, schedules, and event-linked records. | MVP |

| Tasks | Assignments, status, priority, deadlines, checklists, and comments. | MVP |

| Guests & invitations | Individual guest directory, event selection, invitation links, RSVP tracking. | MVP |

| Budget | Budgets, categories, expenses, payment tracking, balances, summaries. | MVP |

| Vendors | Existing vendor records, event assignments, deliverables, agreed costs. | MVP; vendor portal is a scope assumption |

| Wedding website | Published event details and personalised invitation/RSVP pages. | MVP |

| Team & settings | Members, permissions, account settings, privacy, export, and archive controls. | MVP |

| Photo gallery | QR/link uploads, albums, moderation, download/access rules. | Later |

| Wedding-day control room | Guest check-in, operational status board, more detailed live updates. | Later, beyond basic event schedule |

| Livestreaming | Add and share third-party streaming links; richer controls later. | Later |

### 6.2 MVP boundary

The MVP must support a complete planning loop for a real wedding: set up the workspace, add events, invite collaborators, manage tasks, maintain the simple guest list, send event-wise invitations, collect RSVPs, record vendors and expenses, and review progress on a dashboard.

| Release gate Do not treat photo uploads, a custom livestream service, vendor marketplace, native apps, or payment processing as launch blockers for the MVP. |

| --- |

## 7. Functional requirements

Priority definitions: Must = first-release requirement; Should = important but may follow the first usable pilot if needed; Later = outside MVP. Acceptance criteria below are testable outcomes, not a final UI specification.

### 7.1 Wedding setup and onboarding

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| SET-01 | Must | Create wedding workspace | An authenticated owner can create one wedding workspace with couple names and core wedding details. | A saved workspace appears in the owner’s account and can be edited. |

| SET-02 | Must | Configure wedding settings | The owner can configure primary date, location, currency/time preferences, and other basic settings. | Saved settings are consistently reflected across the workspace. |

| SET-03 | Must | Create initial events and invite members | The setup flow can direct the owner to add events and invite collaborators, without requiring all information up front. | The owner can save partial setup and complete it later. |

### 7.2 Dashboard

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| DASH-01 | Must | Wedding-wide summary | Show wedding date/countdown, upcoming events, and overall planning indicators. | The dashboard values are derived from saved records. |

| DASH-02 | Must | Tasks needing attention | Show overdue, upcoming, and high-priority tasks. | Each item links to its underlying task. |

| DASH-03 | Must | Guest and RSVP summary | Show invitations and accepted/pending/declined attendance by event. | Counts match the event invitation records. |

| DASH-04 | Must | Budget snapshot | Show planned budget, recorded expenses, amounts paid, and outstanding balances. | Totals reconcile with expense/payment data. |

| DASH-05 | Should | Recent activity and alerts | Surface relevant team actions, important changes, and upcoming deadlines. | Users see activity appropriate to their permissions. |

### 7.3 Event management

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| EVT-01 | Must | Create, edit, archive events | Create common or custom functions with name, date/time, venue, and description. | Multiple events can exist in one wedding and can be edited independently. |

| EVT-02 | Must | Event detail view | Show the event’s schedule, venue details, linked tasks, invited guests, vendors, and expenses. | A user can navigate from an event to its related records. |

| EVT-03 | Must | Wedding-wide event list | Show all functions in chronological order and provide a wedding-wide overview. | Changing an event updates the timeline and relevant summaries. |

| EVT-04 | Should | Event templates and schedule milestones | Allow reusable starting checklists or milestone templates. | Templates create editable records rather than fixed, unchangeable content. |

### 7.4 Task and checklist management

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| TASK-01 | Must | Create and assign tasks | Task includes title, description (optional), owner, due date, priority, status, and optional linked event/vendor. | Task can be created, assigned, updated, and completed. |

| TASK-02 | Must | Track task status | Support a small status set such as To Do, In Progress, Blocked, and Completed. | Status changes appear consistently in task lists and dashboard counts. |

| TASK-03 | Must | Task views and filters | Provide at least a usable list view with filters for status, owner, due date, and event. | Users can find tasks without manually scanning the entire list. |

| TASK-04 | Should | Checklists, comments, attachments | Allow subtasks/checklist items and practical collaboration notes; attachment support can be constrained initially. | Users can see checklist completion and associated notes. |

| TASK-05 | Should | Deadline reminders | Notify assigned users of upcoming or overdue tasks according to preferences. | Notification contains enough context to open the task. |

### 7.5 Team and permissions

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| TEAM-01 | Must | Invite workspace members | Owner can invite family members and planners to join the wedding workspace. | Invitee can accept access and is assigned a role. |

| TEAM-02 | Must | Enforce role permissions | Restrict modules, events, and sensitive records according to role/permission configuration. | Unauthorised API requests fail even if a user manipulates a URL or record identifier. |

| TEAM-03 | Must | Manage membership | Owner can change a member’s access or remove them. | Removed members cannot access the workspace after revocation. |

| TEAM-04 | Should | Activity history | Record key changes to events, tasks, guest invitations, and expenses. | Relevant actions include actor, time, and changed record. |

### 7.6 Simple guest management

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| GST-01 | Must | Individual guest records | Add, edit, delete, and search guests using a minimal record: name and mobile number; optional email/notes only if needed. | An organiser can maintain the guest list without creating a family-wide invitation. |

| GST-02 | Must | Import guest list | Upload CSV/Excel data with column mapping, validation, and an import preview. | Invalid rows are explained and can be corrected; valid rows can be imported. |

| GST-03 | Must | Duplicate detection | Warn about likely duplicate guests using normalized contact details and name matching. | Duplicates are surfaced for review rather than silently merged. |

| GST-04 | Must | Assign guests to events individually | For each guest, an organiser can select the events to which that person is invited. | One guest can be invited to one, several, or no events. |

| GST-05 | Must | Event-specific guest views | Show the guest list and RSVP statuses for a selected event. | Only invited guests appear in the invitation list; non-invited guests are not counted as pending. |

### 7.7 Event-wise invitation and RSVP

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| INV-01 | Must | Generate a guest-specific invitation link | An organiser can select an event and guest and create a link for that invitation. The link must be unguessable and revocable. | The invitation opens the correct event details without requiring guest login. |

| INV-02 | Must | Personalised digital invitation page | Display couple names, invitation message, relevant event name/date/time/venue, address/map link where available, and RSVP action. | The page is readable on mobile and shows only information appropriate to the invitee. |

| INV-03 | Must | Share by WhatsApp | Provide a ready-to-share message/link through the device’s supported sharing workflow; no automated bulk WhatsApp delivery is required. | The organiser can share the unique link with the intended guest. |

| INV-04 | Must | No-account RSVP | Guest can accept or decline from the invitation page without creating an account. | Response is stored against the correct guest-event invitation. |

| INV-05 | Must | Distinct invitation and RSVP states | UI distinguishes Not Invited, Pending, Accepted, and Declined. Not Invited is derived from absence of an invitation record; the other statuses belong to an invited guest/event. | No one mistakes a non-invited guest for a non-responding invitee. |

| INV-06 | Must | Independent event responses | A guest can accept one event and decline another. | Every response is linked to a specific guest and event. |

| INV-07 | Must | RSVP status and headcount | Show Pending, Accepted, and Declined by event; update summaries after a response. | Counts are recalculated without manual list maintenance. |

| INV-08 | Should | Invitation sharing status | Allow an organiser to record that a link was shared, while making clear that manual sharing does not prove WhatsApp delivery or reading. | The app does not claim delivery/read receipts that it cannot verify. |

| INV-09 | Should | Change or close RSVP | Owner can set whether responses may be changed and close responses for an event. | The page clearly communicates if responses are closed. |

| INV-10 | Must | RSVP reminder workflow | Show invited guests still Pending and let an organiser re-share a reminder message/link for that guest and event. Automated bulk messaging is not required. | The organiser can find pending responses and resend a reminder link without creating a duplicate invitation or falsely claiming delivery. |

### 7.8 Wedding website

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| WEB-01 | Must | Publish a wedding landing page | Provide a template-based, mobile-friendly website with couple names, welcome text, wedding information, and event details. | The owner can preview, publish, edit, and unpublish the site. |

| WEB-02 | Must | Keep RSVP details scoped | Invitation links expose only the invitee’s event details and response controls, not the full guest list. | Changing a URL or guest identifier cannot expose another guest’s invitation. |

| WEB-03 | Must | Shareable URL and venue details | Support a shareable site/link and display address/map link when configured. | Guests can access event directions from a mobile browser. |

| WEB-04 | Should | Basic visual customisation | Offer a small, polished set of templates and controllable colours/cover images. | The owner can personalise the site without using a full website builder. |

### 7.9 Budget and expenses

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| BUD-01 | Must | Set wedding and event budgets | Record a planned overall budget, categories, and optional event allocations. | Category and event totals can be rolled up to wedding-wide totals without double-counting. |

| BUD-02 | Must | Record expenses and vendor costs | Create expenses with amount, category, event/vendor link (optional), date, and notes. | Expense records contribute to the appropriate summary. |

| BUD-03 | Must | Track payments and balances | Record quoted/committed amount where applicable, payments made, and outstanding balance/due date. | The system distinguishes expenses from payments and remaining obligations. |

| BUD-04 | Must | Budget summary | Display planned budget, tracked commitments/expenses, payments, and remaining balances as separately labelled values. | The dashboard does not present unpaid balances as paid. |

| BUD-05 | Should | Payer and responsibility attribution | Record who paid and, if confirmed in scope, which person/family side is responsible or contributes. | A report can group amounts consistently without conflating payer and responsible party. |

### 7.10 Vendor management

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| VEN-01 | Must | Manage existing vendor records | Add/edit vendor name, category, contact details, notes, and linked events. | The system does not require a marketplace listing. |

| VEN-02 | Must | Record agreements and deliverables | Store quoted/agreed cost, due dates, key deliverables, and relevant documents/notes. | Vendor commitments can be linked to a task, event, and expense. |

| VEN-03 | Assumption / confirm | Limited vendor access | Recommended scope: selected vendor can sign in, view assigned event details, and update assigned tasks/deliverables. | Access is restricted to assigned information and can be revoked. |

### 7.11 Notifications and communications

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| NTF-01 | Assumption / confirm | In-app and email alerts | Recommended scope: notify relevant users about task assignment, due dates, event updates, and access invitations. | Users receive actionable notifications and can change preferences. |

| NTF-02 | Must | Manual WhatsApp sharing | Invitation workflow prepares a message and unique URL for the organiser to share. | The platform does not claim an automated send unless an approved integration exists. |

| NTF-03 | Later | Automated WhatsApp messaging | Evaluate official provider integration, template rules, consent, and cost after core validation. | Not a dependency for MVP launch. |

### 7.12 Reporting, settings, and security

| ID | Priority | Requirement | Description | Acceptance criteria |

| --- | --- | --- | --- | --- |

| REP-01 | Must | Export core records | Allow appropriately authorised users to export guest lists, event schedules, task lists, and budget/expense summaries. | Exports respect the user’s permissions and avoid exposing unnecessary data. |

| SEC-01 | Must | Wedding-level data isolation | Every request checks membership and access to the relevant wedding and record. | Users cannot read or modify another wedding’s records by changing IDs. |

| SEC-02 | Must | Secure invitation access | Use high-entropy, scoped, revocable invitation tokens; rate-limit responses and protect against enumeration. | Tokens cannot be feasibly guessed and can be invalidated. |

| SEC-03 | Must | Privacy and lifecycle controls | Provide appropriate export/deletion, access revocation, and workspace archive/deletion workflows. | The product communicates what will happen before destructive actions. |

| SEC-04 | Must | Backup and recovery plan | Back up core workspace records and define restoration procedures before a live pilot. | Recovery procedure is tested before production use. |

| SEC-05 | Must | Sensitive action audit trail | Maintain records for membership/permission changes and material updates to guest responses/expenses. | Authorised administrators can investigate significant changes. |

## 8. Core workflows

### 8.1 Create and prepare a wedding

1. Owner creates the wedding workspace and enters basic details.

2. Owner adds individual functions such as Haldi, Mehendi, Wedding, and Reception.

3. Owner invites family members and/or a coordinator and assigns permissions.

4. Team creates tasks, assigns owners, records vendors, and enters initial budgets.

5. Dashboard presents upcoming work and missing setup items.

### 8.2 Invite a guest to one or more functions

1. Organiser adds a guest manually or imports their record.

2. Organiser opens an event, selects the guest, and creates an individual invitation for that guest-event pair.

3. The system produces a personalised digital invitation link with the correct event details and RSVP action.

4. Organiser shares the message/link through WhatsApp or another supported sharing workflow.

5. Guest opens the link without registering and accepts or declines the event.

6. The event RSVP count updates; invitations to other events remain unchanged.

| RSVP counting example If a person is invited to Haldi and Wedding but not Reception, the person can be Accepted for Haldi, Pending for Wedding, and Not Invited for Reception. Each event’s headcount reflects only its own invitees and responses. |

| --- |

### 8.3 Manage an expense

1. An authorised user creates an expense and optionally links it to a vendor and event.

2. The user enters the quoted/committed amount (if tracked), payments made, and remaining due amount/date.

3. Dashboard and reports display clearly labelled totals for the wedding and relevant event.

4. Permission rules prevent users without financial access from viewing or changing restricted expense records.

### 8.4 Change an event date

1. An authorised user edits the event date/time.

2. The updated schedule appears in event detail and wedding-wide views.

3. Relevant collaborators are notified according to notification settings.

4. The invitation page shows the updated details; an explicit notification/re-invitation policy for already-invited guests should be defined before launch.

## 9. Business rules and data concepts

### 9.1 Core entities

| Entity | Purpose | Important relationships |

| --- | --- | --- |

| Wedding | The main workspace. | Has members, events, guests, vendors, expenses, tasks, and settings. |

| User | Person with an authenticated account. | Can be a member of one or more weddings. |

| WeddingMembership | User’s membership, role, and permission scope. | Connects user to wedding and controls access. |

| Event | A wedding function with date/time and venue. | Belongs to one wedding; can have tasks, invitees, vendors, and expenses. |

| Task | A piece of work with owner, status, priority, and deadline. | Belongs to a wedding; may link to an event or vendor. |

| Guest | An invited individual’s contact record. | Belongs to a wedding; can have invitations for multiple events. |

| EventInvitation / RSVP | Invitation relationship and response for a guest-event pair. | Unique per guest-event pair; tracks invitation token and response state. |

| Vendor | Existing service provider record. | Can be assigned to events and linked to tasks, documents, and expenses. |

| Budget / Expense / Payment | Planned budget, costs, and amounts paid. | Can be grouped by category, event, or vendor. |

| ActivityLog | Record of significant actions. | References actor, wedding, record, action, and timestamp. |

| MediaAsset (later) | Photo or related media metadata. | Belongs to a wedding/event and has explicit access/moderation rules. |

### 9.2 Key business rules

- One wedding workspace contains multiple events; an event is not a separate wedding workspace.

- Guest Management remains lightweight. Household grouping is not required for the invitation default; the core invitation unit is an individual guest.

- An invitation exists for a specific guest and event. A guest may be invited to multiple events and have a different response for each.

- “Not Invited” means no invitation exists for that guest-event pair. “Pending”, “Accepted”, and “Declined” apply only after invitation creation.

- An invitation link must be scoped to the intended guest/event response and must not reveal the complete guest list.

- The app must distinguish invite sharing from actual delivery and reading. Manual WhatsApp sharing provides no verified delivery receipt by itself.

- Attendance counts should be calculated from current invitation and RSVP data; they should not be manually duplicated in a second count field.

- Planned, committed, incurred, paid, and outstanding amounts are different financial concepts and should have clear labels.

- All data changes and reads must respect the workspace membership and relevant permissions.

- Archiving or deleting a wedding requires explicit confirmation and a clear explanation of the consequences.

## 10. Non-functional requirements

| Area | Requirement |

| --- | --- |

| Responsive UX | Usable on modern desktop, tablet, and mobile browsers; guest invitation pages are designed mobile-first. |

| Performance | Common list, dashboard, and invitation interactions should feel responsive under expected MVP loads. Use pagination/filtering for guest lists and avoid loading all records at once. |

| Scale | Support several hundred guests per wedding and multiple events without requiring manual workarounds. |

| Security | Enforce server-side authorization, secure sessions, scoped invitation tokens, rate limiting, input validation, and protection against common web threats. |

| Privacy | Collect the minimum guest data needed; explain visibility; support appropriate export/deletion and access revocation; seek qualified review of applicable privacy obligations before launch. |

| Reliability | Define backup, recovery, error logging, and support procedures before a real wedding pilot. |

| Data integrity | Prevent duplicate RSVP submissions from corrupting counts; make critical writes safe against retries and concurrent edits. |

| Accessibility | Use readable contrast, labels, keyboard-accessible forms, and clear errors; do not rely on colour alone for RSVP status. |

| Observability | Capture application errors and meaningful product events without logging invitation tokens, sensitive guest data, or unnecessary personal information. |

| Localisation readiness | Keep labels, date/time formats, currency, and phone parsing configurable. Initial launch language and regional settings remain to be confirmed. |

## 11. Success metrics and validation plan

### 11.1 North-star metric

| Weekly active wedding workspaces Count wedding workspaces where at least two authorised people contribute and meaningful activity occurs in more than one planning module during a week. This signals real collaborative use better than account creation alone. |

| --- |

### 11.2 Supporting metrics

| Metric | Definition / reason |

| --- | --- |

| Activation | A wedding workspace is created, at least one event is added, and one collaborator or guest workflow is configured. |

| Collaboration depth | Number of distinct active collaborators per wedding and number of tasks updated by someone other than the owner. |

| Guest invitation conversion | Share of created invitations that receive a response; segment by event and sharing approach. |

| RSVP completion | Share of invited guest-event pairs with Accepted or Declined status by the configured response deadline. |

| Planning coverage | Whether the pilot team manages events, tasks, guest invitations, and expenses inside the product rather than keeping separate parallel records. |

| Coordination effort | Qualitative feedback on missed follow-ups, duplicate entry, confusion, and time spent maintaining wedding information. |

| Reliability and trust | Invitation failure rate, data correction incidents, permission defects, and support issues. |

### 11.3 Validation plan

1. Interview 8–12 couples or family members, including people who recently planned a wedding and people currently planning one; use several coordinator interviews to check operational needs.

2. Observe current tools and workflows (for example, spreadsheets and chat-based coordination) with personal information redacted.

3. Test a clickable prototype with representative users before implementation.

4. Run a small pilot with approximately 2–3 real weddings as an initial learning target, not a hard business commitment.

5. Interview pilot users during planning and after the main events; prioritise changes based on observed friction and repeat use.

Numerical go/no-go thresholds should be set after interviews and baseline observations; avoid treating unvalidated target percentages as commitments.

## 12. Release plan

| Stage | Scope | Exit condition |

| --- | --- | --- |

| Stage 0 — Product validation | Interviews, workflow inventory, prototype, and confirmation of remaining scope assumptions. | Users can explain the current pain and complete prototype tasks; the first pilot region and language are chosen. |

| Stage 1 — MVP build | Wedding workspace, events, tasks, team permissions, simple guest list/import, guest-event invitations/RSVP, digital invitation page, budget/expenses, vendor records, dashboard, basic notifications, security/export. | An end-to-end wedding workflow passes test cases using realistic data and hundreds of guest records. |

| Stage 2 — Real-world pilot | Use with a small set of weddings; monitor errors, adoption, guest response, and manual workarounds. | Pilot feedback demonstrates recurring value and identifies the highest-priority fixes. |

| Stage 3 — Operational enhancements | Improve notification automation, wedding-day view, richer vendor collaboration, and exports based on evidence. | Core workflows remain reliable and users confirm need for operational enhancements. |

| Stage 4 — Guest media | Photo gallery, QR/link uploads, moderation, and basic third-party livestream integration. | Privacy, storage, permissions, costs, and event-day support model are defined. |

## 13. Risks and mitigations

| Risk | Impact | Mitigation |

| --- | --- | --- |

| Scope creep | Build takes too long and key workflows remain unvalidated. | Protect MVP boundaries; defer advanced media, marketplace, payment, AI, and travel features. |

| Low family adoption | People continue using disconnected tools. | Keep common actions simple, delegate responsibilities, and allow familiar WhatsApp sharing. |

| Guest-list entry burden | Families abandon setup before inviting guests. | Provide CSV/Excel import, preview, error explanations, duplicate detection, and bulk event assignment. |

| Invitation link privacy | Guest data is exposed or another person’s RSVP can be changed. | Use scoped, unguessable, revocable tokens; rate-limit; test authorisation and token enumeration cases. |

| Incorrect headcounts | Catering and venue decisions rely on wrong event totals. | Model each guest-event invitation uniquely; calculate counts from current responses and define treatment of plus-ones. |

| Confusing financial summaries | Users mistake unpaid commitments for paid spending. | Label planned, committed, incurred, paid, and outstanding values separately. |

| Manual messaging ambiguity | Users assume invitation has been delivered or read. | Show share status separately; do not claim delivery/read receipts without a supported integration. |

| Sensitive data exposure | Family trust is damaged by broad permissions. | Apply least privilege, server-side checks, revocation, audit history, and privacy reviews. |

| One-time customer lifecycle | Individual couples may not pay a recurring subscription after the wedding. | Validate willingness to pay later; explore one-time wedding plans before relying on consumer subscription revenue. |

| Operational reliability | Failure during a wedding creates immediate stress. | Test recovery, provide support guidance, monitor incidents, and keep exports available. |

## 14. Dependencies and open decisions

### 14.1 External dependencies

- Hosting, domain, database, file storage, email delivery, and monitoring must be selected during technical planning.

- WhatsApp link sharing can begin with device/browser share intents or a prefilled message workflow; automated WhatsApp messaging requires separate integration research and should not block MVP.

- Maps can initially use a simple address and external map link instead of an embedded map service.

- Photo storage and livestream delivery are later-stage integrations, not MVP infrastructure dependencies.

### 14.2 Open decisions before implementation is locked

| Decision | Current position | Why it matters |

| --- | --- | --- |

| Launch city/region | Not selected. | Affects pilot recruitment, event customs, language and templates. |

| Product name/branding | Working title only. | Needed for customer-facing copy, domain and design. |

| Initial language | Recommended English-first; not explicitly confirmed. | Affects UX copy and localisation approach. |

| Member permission granularity | Principle agreed; exact matrix open. | Determines access model and test cases. |

| Vendor account scope | Limited view/update assigned tasks recommended. | Affects the first-release permissions and UI. |

| Notification delivery | In-app/email plus manual WhatsApp sharing recommended. | Affects infrastructure and message integration costs. |

| Expense attribution | Need to confirm whether MVP includes family-side split responsibility. | Affects expense data model and reports. |

| Guest response details | Core accept/decline agreed; plus-ones and child counts need a simple policy. | Affects RSVP and headcount rules. |

| Invitation change policy | Need to decide what happens when event details change or RSVP closes. | Prevents guests seeing stale details and sets expectations. |

| Privacy and retention | Exact defaults require product/legal review. | Affects public wedding pages, invitation link expiry, media access, and deletion. |

| Pricing and monetisation | Not set; initial goal is first-hand validation. | Should follow evidence of value and willingness to pay. |

| Technical stack and delivery timeline | Not selected in this PRD. | Requires engineering/design capacity and deployment planning. |

## 15. MVP acceptance checklist

The MVP is ready for a controlled pilot only when the following end-to-end conditions are met:

- [ ] An owner can create a wedding workspace and add multiple functions.

- [ ] The owner can invite collaborators and revoke access; server-side permissions are tested.

- [ ] Authorised users can create, assign, filter, and complete tasks.

- [ ] An organiser can add or import hundreds of individual guest records and review import errors/duplicates.

- [ ] An organiser can invite a guest to one event without inviting them to every event.

- [ ] A guest can open a personalised invitation page on mobile without an account and accept or decline the relevant event.

- [ ] Each guest-event pair has an independent response, and Not Invited is not counted as Pending.

- [ ] RSVP changes update the correct event counts without duplicate records or manual reconciliation.

- [ ] The site does not reveal the complete guest list or another guest’s response through invitation URLs.

- [ ] Expenses, payments, and outstanding balances are represented separately and dashboard totals reconcile.

- [ ] Existing vendor information can be stored and linked to events/tasks; if vendor logins are enabled, least-privilege tests pass.

- [ ] Core records can be exported by an authorised user.

- [ ] Backups, recovery steps, error monitoring, and a support path are available before the live pilot.

- [ ] The team has tested the main workflow across desktop and mobile browsers with realistic wedding data.
