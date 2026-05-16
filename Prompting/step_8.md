You are a senior staff-level realtime systems architect building a production-grade multiplayer coding arena platform.

The project already has:

* React + Vite + TypeScript
* TailwindCSS
* Zustand
* TanStack Query
* React Router
* Supabase backend
* Supabase Auth
* Production-grade Socket.IO foundation
* Contest creation/join system
* Contest lobby system
* Problem system
* Monaco editor workspace
* Contest start system
* Locked/unlocked problem access
* Contest timer foundation
* Submission system foundation
* Simulated verdict system
* Participant progress tracking
* Discord-inspired desktop UI

IMPORTANT:
This platform has NO admin system.
Contest creators manage their own contests.

==================================================
STEP 8 GOAL
===========

Implement the COMPLETE Realtime Competitive Layer.

This step should transform the platform into a true live multiplayer coding arena.

==================================================
IMPORTANT
=========

DO NOT implement:

* real Docker judge
* secure sandbox execution
* real compiler infrastructure
* plagiarism detection
* matchmaking system
* battle mode

Keep the implementation focused on:

* realtime contest synchronization
* leaderboard systems
* participant live activity
* websocket-driven contest experience

==================================================
CORE FEATURES
=============

Implement:

1. realtime leaderboard
2. realtime participant presence
3. realtime solve feed
4. contest synchronization
5. live contest state updates
6. automatic contest ending
7. websocket event architecture
8. live participant activity tracking

==================================================
SOCKET.IO REALTIME ARCHITECTURE
===============================

Expand the existing Socket.IO foundation properly.

Create scalable realtime event architecture such as:

* contest:join
* contest:leave
* contest:start
* contest:end
* submission:created
* submission:judged
* participant:solved
* leaderboard:update
* participant:status

The architecture must be:

* modular
* scalable
* production-grade
* future-ready

==================================================
REALTIME LEADERBOARD
====================

Implement a live leaderboard system.

Leaderboard should update automatically without refresh.

Ranking logic should support:

* solved problems count
* solve timestamps
* penalties
* submission counts

Display:

* rank
* username
* solved count
* penalty
* latest solve time

Leaderboard must update live after:

* accepted submissions
* contest events
* contest end

==================================================
LIVE PARTICIPANT PRESENCE
=========================

Track participant realtime status.

Statuses may include:

* coding
* idle
* viewing problem
* disconnected
* solved problem

Display participant states inside contest UI.

==================================================
LIVE SOLVE FEED
===============

Create realtime activity feed.

Examples:

* "Shourov solved Problem B"
* "Alex submitted Problem C"
* "Contest has started"
* "Contest has ended"

Feed should update live using Socket.IO.

==================================================
REALTIME CONTEST SYNCHRONIZATION
================================

Synchronize across all participants:

* contest status
* timer state
* leaderboard
* participant activity
* solve states

Users should NEVER need manual refreshes.

==================================================
CONTEST END SYSTEM
==================

When timer reaches zero:

1. contest automatically ends
2. submissions become locked
3. leaderboard freezes
4. final standings appear

Ensure synchronization across all users.

==================================================
SUBMISSION INTEGRATION
======================

Connect the submission system with realtime updates.

After verdict processing:

* leaderboard updates
* participant progress updates
* solve feed updates
* participant status updates

==================================================
DATABASE REQUIREMENTS
=====================

Use Supabase.

If schema changes are needed:

* create proper SQL migration files
* place them inside supabase/migrations
* keep migrations modular and production-grade

Optimize database architecture for:

* realtime ranking queries
* participant progress
* leaderboard calculations
* contest synchronization

==================================================
LEADERBOARD LOGIC
=================

Implement scalable ranking calculation logic.

Support:

* accepted solve counts
* penalties
* first accepted timestamps

The architecture should support future:

* Codeforces-style scoring
* ICPC scoring
* dynamic scoring systems

==================================================
STATE MANAGEMENT
================

Create scalable Zustand architecture for:

* realtime contest state
* leaderboard state
* participant presence
* solve feed
* websocket event state

Avoid giant monolithic stores.

==================================================
QUERY + SOCKET STRATEGY
=======================

Use proper hybrid architecture:

* TanStack Query for persistence/data fetching
* Socket.IO for live synchronization
* optimistic realtime updates where appropriate

==================================================
UI REQUIREMENTS
===============

Maintain the existing:

* Discord-inspired layout
* desktop-native feel
* dark professional UI

Create a true esports-style live contest experience.

==================================================
LIVE CONTEST DASHBOARD
======================

Transform contest lobby into a realtime contest dashboard.

Include:

* live leaderboard
* participant sidebar
* realtime solve feed
* contest timer
* participant activity indicators

==================================================
ANIMATION REQUIREMENTS
======================

Use subtle performant animations for:

* leaderboard rank changes
* new solve feed events
* participant activity changes
* live updates

Animations must remain:

* smooth
* GPU accelerated
* minimal
* professional

==================================================
PERFORMANCE REQUIREMENTS
========================

Optimize for:

* minimal rerenders
* scalable websocket updates
* efficient leaderboard updates
* stable realtime synchronization
* smooth large contest rendering

The architecture should support future scaling to:

* hundreds of participants
* high-frequency submissions
* heavy realtime activity

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* modular realtime architecture
* scalable websocket handlers
* reusable realtime components
* proper typing everywhere
* clean separation of concerns

==================================================
CREATE REUSABLE COMPONENTS
==========================

Create reusable components such as:

* LiveLeaderboard
* LeaderboardRow
* ParticipantPresencePanel
* LiveSolveFeed
* ContestActivityFeed
* RealtimeContestDashboard
* ParticipantStatusBadge
* ContestEndModal
* LiveContestTimer

==================================================
IMPORTANT
=========

Do NOT overengineer.
Do NOT build real Docker execution infrastructure yet.
Focus ONLY on the complete realtime competitive layer.

==================================================
AT THE END
==========

Explain:

* realtime architecture
* websocket synchronization strategy
* leaderboard calculation strategy
* contest synchronization logic
* scalability reasoning
* future real judge compatibility
* future scaling readiness
