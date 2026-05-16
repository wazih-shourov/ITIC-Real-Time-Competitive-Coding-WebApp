You are a senior full-stack realtime systems architect.

The project already has:

* React + Vite + TypeScript
* TailwindCSS
* Zustand
* TanStack Query
* React Router
* Supabase Auth
* User profile system
* Production-grade Socket.IO foundation
* Discord-inspired desktop layout

Now implement ONLY the Contest Room Foundation system.

IMPORTANT:
Keep the implementation SMALL, focused, modular, and production-grade.

DO NOT implement:

* coding judge
* problem solving
* submissions
* leaderboard logic
* contest timers
* matchmaking
* realtime contest sync
* battle system
* chat system

This step is ONLY for:

* contest creation
* contest joining
* contest lobby foundation
* contest room architecture

==================================================
GOAL
====

Users should be able to:

1. Create contests
2. Receive a unique Contest ID
3. Join contests using the Contest ID
4. Enter a contest lobby page

==================================================
SUPABASE REQUIREMENTS
=====================

Use Supabase as the backend.

If database tables are required:

* create proper SQL migration files
* place them inside a dedicated supabase/migrations folder
* separate migrations cleanly
* use production-grade SQL structure
* add proper foreign keys and indexes

==================================================
DATABASE REQUIREMENTS
=====================

Create clean scalable tables for:

* contests
* contest_participants

The architecture should support future:

* realtime sync
* leaderboard
* problems
* submissions
* battles

WITHOUT requiring major refactors later.

==================================================
CONTEST CREATION
================

Create contest creation flow.

Fields:

* contest name
* description
* visibility
* max participants

Generate:

* unique contest ID
* creator ownership

Store everything in Supabase.

==================================================
CONTEST JOIN SYSTEM
===================

Users can join contests using Contest ID.

Requirements:

* validate contest existence
* prevent duplicate joins
* handle invalid IDs cleanly
* add participant to contest_participants

==================================================
CONTEST LOBBY
=============

After joining:
Redirect users into a Contest Lobby page.

Lobby should display:

* contest info
* participant list
* creator info
* contest visibility
* joined users count

NO realtime updates yet.

==================================================
UI REQUIREMENTS
===============

Maintain the existing:

* Discord-style layout
* desktop-native feel
* dark professional UI

Use:

* smooth transitions
* polished cards
* subtle animations
* clean spacing

==================================================
STATE MANAGEMENT
================

Create scalable Zustand architecture for:

* current contest
* joined contests
* lobby state

Avoid giant stores.

==================================================
QUERY ARCHITECTURE
==================

Use TanStack Query properly for:

* contest fetching
* join requests
* lobby data
* cache updates

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* reusable components
* modular architecture
* scalable folder structure
* clean service layer
* proper typing everywhere

==================================================
CREATE REUSABLE COMPONENTS
==========================

Create reusable components such as:

* ContestCard
* ContestLobbyCard
* JoinContestModal
* CreateContestModal
* ParticipantList
* ContestHeader

==================================================
IMPORTANT
=========

Keep the implementation focused and minimal.

Do NOT overbuild.
Do NOT implement future systems now.
Do NOT hallucinate unnecessary features.

Build ONLY the clean Contest Room Foundation.

==================================================
AT THE END
==========

Explain:

* database architecture
* migration structure
* contest flow
* scalability reasoning
* future expansion readiness
