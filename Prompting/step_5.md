You are a senior full-stack architect building a production-grade realtime coding arena platform.

The project already has:

* React + Vite + TypeScript
* TailwindCSS
* Zustand
* TanStack Query
* React Router
* Supabase backend
* Supabase Auth
* User profile system
* Production-grade Socket.IO foundation
* Contest creation system
* Contest join system
* Contest lobby system
* Discord-inspired desktop UI

IMPORTANT:
This platform has NO admin system.
There is NO Admin HQ.

Contest creators themselves manage their own contests and problems.

==================================================
STEP 5 GOAL
===========

Implement ONLY the Problem System Foundation.

This step is ONLY for:

* problem database architecture
* problem creation
* attaching problems to contests
* problem viewing
* Monaco editor integration
* coding workspace UI foundation

==================================================
IMPORTANT
=========

DO NOT implement:

* code execution
* judge system
* submissions
* verdict logic
* leaderboard
* contest timers
* realtime contest sync
* matchmaking
* battles
* chat
* plagiarism detection

Keep the implementation focused, modular, and production-grade.

==================================================
PROBLEM DATABASE ARCHITECTURE
=============================

Use Supabase.

Create proper migration SQL files inside:
supabase/migrations

Create scalable tables for:

* problems
* contest_problems

The schema must support future:

* submissions
* test cases
* verdicts
* realtime contests
* rankings

WITHOUT requiring major refactors later.

==================================================
PROBLEMS TABLE REQUIREMENTS
===========================

Include fields such as:

* id
* title
* slug
* description
* difficulty
* starter_code
* examples
* constraints
* creator_id
* created_at
* updated_at

==================================================
CONTEST_PROBLEMS TABLE
======================

Create relationship architecture for:

* contest_id
* problem_id
* order_index

This will allow ordered problems inside contests later.

==================================================
PROBLEM CREATION FLOW
=====================

Contest creators should be able to:

* create problems
* edit problems
* attach problems to contests

Problem creation form should support:

* title
* difficulty
* description
* examples
* constraints
* starter code

==================================================
CONTEST PROBLEM ATTACHMENT
==========================

Inside contest management:
contest creators can:

* select problems
* attach them to a contest
* reorder problems

No realtime sync needed yet.

==================================================
PROBLEM LIST UI
===============

Inside a contest:
display problem list like:

* Problem A
* Problem B
* Problem C

Show:

* title
* difficulty
* order

==================================================
PROBLEM WORKSPACE PAGE
======================

Create a professional coding workspace page.

Layout:
LEFT SIDE:

* problem statement
* examples
* constraints
* metadata

RIGHT SIDE:

* Monaco Editor

The UI should feel similar to:

* LeetCode
* Codeforces
* HackerRank
* VS Code

==================================================
MONACO EDITOR REQUIREMENTS
==========================

Integrate Monaco Editor properly.

Requirements:

* dark theme
* language selector
* starter code support
* responsive resizing
* smooth editor mounting
* lazy loading optimization

NO code execution yet.

==================================================
STATE MANAGEMENT
================

Create scalable Zustand architecture for:

* current problem
* editor state
* selected language
* contest problem state

Avoid giant monolithic stores.

==================================================
QUERY ARCHITECTURE
==================

Use TanStack Query properly for:

* fetching problems
* contest problem lists
* problem details
* cache synchronization

==================================================
UI REQUIREMENTS
===============

Maintain the existing:

* Discord-inspired layout
* desktop-native feel
* smooth UX
* dark professional aesthetic

Use:

* subtle animations
* polished cards
* smooth transitions
* optimized layouts

==================================================
PERFORMANCE REQUIREMENTS
========================

Optimize for:

* minimal rerenders
* lazy Monaco loading
* smooth editor experience
* scalable workspace rendering

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* scalable architecture
* reusable components
* proper typing
* clean separation of concerns

==================================================
CREATE REUSABLE COMPONENTS
==========================

Create reusable components such as:

* ProblemCard
* ProblemList
* ProblemHeader
* ProblemWorkspace
* MonacoEditorPanel
* ProblemDescriptionPanel
* CreateProblemModal
* AttachProblemModal

==================================================
IMPORTANT
=========

Do NOT overbuild.
Do NOT hallucinate future systems.
Build ONLY the clean Problem System Foundation.

==================================================
AT THE END
==========

Explain:

* database architecture
* migration structure
* Monaco integration strategy
* workspace architecture
* scalability reasoning
* future judge-system readiness
