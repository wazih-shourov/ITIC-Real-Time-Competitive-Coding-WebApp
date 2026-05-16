You are a senior full-stack realtime systems architect building a production-grade multiplayer coding arena platform.

The project already has:

* React + Vite + TypeScript
* TailwindCSS
* Zustand
* TanStack Query
* React Router
* Supabase backend
* Supabase Auth
* Production-grade Socket.IO foundation
* Contest creation system
* Contest join system
* Contest lobby system
* Problem system
* Monaco editor workspace
* Contest problem attachment system
* Discord-inspired desktop UI

IMPORTANT:
This platform has NO admin system.
Contest creators manage their own contests.

==================================================
STEP 6 GOAL
===========

Implement ONLY the Contest Start System Foundation.

This step is ONLY for:

* contest start flow
* contest status management
* locked/unlocked problem access
* global contest timer foundation
* host control system
* contest state synchronization foundation

==================================================
IMPORTANT
=========

DO NOT implement:

* code execution
* judge system
* verdict system
* submissions
* realtime leaderboard
* ranking system
* matchmaking
* battles
* chat
* live activity feed

Keep the implementation focused, modular, scalable, and production-grade.

==================================================
CONTEST STATE SYSTEM
====================

Implement scalable contest states such as:

* waiting
* active
* ended

Store contest state properly in Supabase.

The architecture must support future realtime contest systems.

==================================================
DATABASE REQUIREMENTS
=====================

If database changes are needed:

* create proper SQL migration files
* place them inside supabase/migrations
* keep migrations modular and production-grade

Update contest architecture to support:

* contest status
* started_at
* ended_at
* duration_minutes

==================================================
HOST CONTROL SYSTEM
===================

Only the contest creator/host can:

* start contest
* end contest

Participants CANNOT control contest state.

Implement proper ownership validation.

==================================================
START CONTEST FLOW
==================

When host clicks:
"Start Competition"

The system should:

1. update contest status from waiting → active
2. save started_at timestamp
3. activate contest timer
4. unlock contest problems
5. synchronize contest state across participants

==================================================
LOCKED PROBLEM SYSTEM
=====================

Before contest starts:

* problems must appear visually locked
* gray/disabled state
* unclickable
* no navigation allowed

After contest starts:

* problems become accessible
* clickable
* workspace accessible

Implement proper route protection so users cannot bypass lock state manually via URL.

==================================================
CONTEST TIMER FOUNDATION
========================

Implement global contest timer architecture.

Requirements:

* timer based on started_at
* synchronized across users
* stable refresh-safe timer logic
* duration-based countdown

Display timer in:

* contest lobby
* contest workspace

NO realtime websocket timer sync required yet.
Use stable timestamp-based logic.

==================================================
LOBBY TRANSITION SYSTEM
=======================

Before contest start:
Lobby shows:

* waiting state
* preparation UI
* participant list
* locked problems

After contest starts:
Lobby transforms into:

* active contest dashboard
* running timer
* participant panel placeholder
* leaderboard placeholder UI

Leaderboard can be placeholder-only for now.
NO ranking logic yet.

==================================================
PARTICIPANT PANEL
=================

Create scalable participant sidebar architecture.

Display:

* joined users
* avatars
* usernames

Prepare architecture for future realtime status indicators.

==================================================
PROBLEM ACCESS CONTROL
======================

Participants:

* can access problems ONLY when contest is active

Hosts:

* remain inside lobby/dashboard
* do not automatically enter problem workspace

==================================================
STATE MANAGEMENT
================

Create scalable Zustand architecture for:

* contest status
* timer state
* locked/unlocked problem state
* host controls

Avoid giant monolithic stores.

==================================================
QUERY ARCHITECTURE
==================

Use TanStack Query properly for:

* contest state fetching
* timer synchronization
* participant fetching
* contest refresh state

==================================================
UI REQUIREMENTS
===============

Maintain the existing:

* Discord-inspired layout
* desktop-native feel
* dark professional UI

Use:

* smooth transitions
* polished state changes
* subtle animations
* elegant locked states

Locked problems should visually feel:

* unavailable
* disabled
* waiting for activation

==================================================
PERFORMANCE REQUIREMENTS
========================

Optimize for:

* minimal rerenders
* stable timer updates
* scalable contest state management
* refresh-safe contest synchronization

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* reusable architecture
* scalable folder structure
* proper separation of concerns
* strong typing everywhere

==================================================
CREATE REUSABLE COMPONENTS
==========================

Create reusable components such as:

* ContestTimer
* LockedProblemCard
* ActiveProblemCard
* ContestStatusBanner
* ParticipantSidebar
* ContestControlPanel
* WaitingLobbyView
* ActiveContestView

==================================================
IMPORTANT
=========

Do NOT overengineer.
Do NOT hallucinate future systems.
Build ONLY the Contest Start System Foundation cleanly and professionally.

==================================================
AT THE END
==========

Explain:

* contest state architecture
* timer synchronization logic
* locked problem protection strategy
* host control validation
* future realtime readiness
* scalability reasoning
