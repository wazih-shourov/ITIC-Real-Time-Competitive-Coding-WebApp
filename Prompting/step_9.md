You are a senior fullstack realtime systems engineer working on a multiplayer coding contest platform.

The platform already has:

* React + Vite + TypeScript
* TailwindCSS
* Zustand
* TanStack Query
* Supabase
* Socket.IO realtime layer
* Contest lobby
* Realtime leaderboard
* Submission system
* Monaco editor
* Participant presence
* Contest synchronization

==================================================
GOAL
====

Implement a HOST REVIEW PANEL system.

This is NOT an admin panel.

This feature is ONLY visible to:

* the contest host/creator

Participants must NEVER see these controls.

==================================================
FEATURE OVERVIEW
================

When participants submit code during a contest:

The host should see:

* live submission cards
* participant names
* problem names
* total submission counts

The host can:

* click a participant submission card
* view all submitted problems by that participant
* open submitted code
* review code in formatted readable structure
* manually set verdicts:

  * Accepted
  * Wrong Answer
  * Rejected

When the host updates a verdict:

* Supabase updates instantly
* realtime leaderboard updates instantly
* participant solve states update instantly
* all connected users synchronize automatically

==================================================
IMPORTANT
=========

This feature is:

* contest-host-only
* NOT global admin moderation

==================================================
HOST LOBBY EXPERIENCE
=====================

Inside the contest lobby:

If current user === contest host:
show an additional sidebar/panel section:

Example:

* Live Submissions
* Recent Participant Submissions

This section should display realtime submission cards.

Each card should show:

* participant username
* submitted problem title
* submission count
* latest submission time
* current verdict status

==================================================
REALTIME REQUIREMENT
====================

As soon as a participant submits:
the host panel should update LIVE via Socket.IO.

No manual refreshes.

==================================================
SUBMISSION REVIEW FLOW
======================

Flow:

1. Host clicks submission card
2. Modal opens
3. Modal shows participant submissions
4. Host clicks a problem submission
5. Another modal/panel opens
6. Full submitted code becomes visible

==================================================
CODE VIEWER REQUIREMENTS
========================

Display submitted code:

* properly formatted
* preserve indentation
* preserve line breaks
* monospace font
* syntax-highlight-ready architecture

DO NOT use plain broken text rendering.

Use:

* readonly Monaco editor
  OR
* proper code viewer component

The code must look professional and readable.

==================================================
VERDICT CONTROL
===============

Inside code review modal:

Add verdict control dropdown/button.

Host can set:

* Accepted
* Wrong Answer
* Rejected

When verdict changes:

* update Supabase instantly
* emit websocket event
* refresh leaderboard
* refresh participant solve states
* refresh activity feed if needed

==================================================
DATABASE REQUIREMENTS
=====================

If schema updates are required:

* create proper SQL migration files
* place inside supabase/migrations
* keep migrations modular

==================================================
REALTIME ARCHITECTURE
=====================

Integrate with existing Socket.IO architecture.

Suggested events:

* submission:created
* submission:updated
* verdict:changed

Ensure:

* room-scoped realtime events
* no duplicate events
* proper cleanup

==================================================
SECURITY REQUIREMENTS
=====================

CRITICAL:

Only contest hosts can:

* view submissions
* review code
* change verdicts

Participants must NEVER:

* access other users' code
* access review APIs
* access verdict controls

Enforce:

* frontend guards
* Supabase RLS
* backend validation

==================================================
LEADERBOARD INTEGRATION
=======================

Existing realtime leaderboard already exists.

Integrate manual verdict system so:

* Accepted immediately affects rankings
* Wrong Answer does not increase solve count
* ranking updates live

==================================================
UI/UX REQUIREMENTS
==================

Maintain existing:

* dark Discord-inspired UI
* smooth animations
* desktop-native feel

Host review system should feel:

* clean
* fast
* esports-like
* professional

==================================================
COMPONENT REQUIREMENTS
======================

Create reusable components such as:

* HostSubmissionPanel
* SubmissionReviewModal
* SubmissionListCard
* CodeReviewViewer
* VerdictDropdown
* HostSubmissionSidebar

==================================================
PERFORMANCE REQUIREMENTS
========================

Optimize for:

* large submission counts
* minimal rerenders
* efficient realtime updates
* stable modal rendering

Avoid:

* fetching all code repeatedly
* giant unoptimized state updates

==================================================
IMPORTANT
=========

Do NOT overengineer.
Do NOT build full judge infrastructure.
Do NOT refactor unrelated systems.

Only implement:
production-grade manual host review workflow.

==================================================
AT THE END
==========

Explain:

* realtime synchronization strategy
* security protections
* leaderboard synchronization logic
* submission flow architecture
* performance optimization decisions
