You are a senior staff-level frontend/backend systems architect performing a production-readiness stabilization pass for a realtime multiplayer coding arena platform.

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
* Realtime contest lobby
* Problem system
* Monaco editor workspace
* Contest start system
* Locked/unlocked problems
* Contest timer system
* Submission system
* Simulated verdict system
* Realtime leaderboard
* Live participant presence
* Live solve feed
* Contest synchronization layer

==================================================
STEP 8.5 GOAL
=============

Perform a COMPLETE production-grade stability, synchronization, UX, and architecture audit/refinement pass.

This is NOT a feature-building step.

This step is ONLY for:

* bug fixing
* stability improvements
* realtime synchronization hardening
* UX refinement
* performance optimization
* architecture cleanup
* race-condition prevention
* refresh recovery
* memory leak prevention

==================================================
IMPORTANT
=========

DO NOT build:

* Docker judge
* real code execution
* matchmaking
* battle system
* notifications
* profile systems
* deployment infra

Do NOT add major new features.

Focus ONLY on making the current platform:

* stable
* scalable
* smooth
* production-grade

==================================================
FULL PLATFORM AUDIT
===================

Perform a deep audit of:

* frontend architecture
* Zustand stores
* TanStack Query usage
* websocket lifecycle
* contest synchronization
* timer synchronization
* realtime leaderboard logic
* participant presence system
* submission synchronization
* Monaco editor lifecycle
* Supabase query architecture
* rerender patterns
* route protection
* refresh recovery
* memory leaks

==================================================
SOCKET.IO STABILITY HARDENING
=============================

Audit and improve:

* reconnect handling
* stale socket listeners
* duplicate websocket events
* event cleanup
* reconnect synchronization
* race conditions
* contest resync after reconnect

Ensure:

* zero duplicate event processing
* proper listener cleanup
* stable reconnect lifecycle
* safe socket state restoration

==================================================
REFRESH RECOVERY SYSTEM
=======================

Ensure users can refresh safely during contests.

After refresh:

* contest state restores correctly
* timer restores correctly
* leaderboard restores correctly
* workspace restores correctly
* problem state restores correctly
* participant state restores correctly

Users should never become desynchronized after refresh.

==================================================
TIMER SYNCHRONIZATION AUDIT
===========================

Audit:

* timer drift
* countdown consistency
* refresh-safe timing
* client/server timestamp mismatch

Timer must remain accurate across:

* reconnects
* refreshes
* multiple users

==================================================
LEADERBOARD STABILITY AUDIT
===========================

Audit:

* duplicate rank updates
* stale leaderboard state
* race conditions
* incorrect ordering
* delayed updates

Ensure leaderboard updates remain:

* deterministic
* stable
* consistent

==================================================
PARTICIPANT PRESENCE AUDIT
==========================

Audit:

* ghost participants
* stale online states
* disconnect handling
* reconnect restoration
* presence synchronization

==================================================
MONACO EDITOR OPTIMIZATION
==========================

Audit and optimize:

* editor mounting
* rerenders
* memory usage
* autosave readiness
* language switching
* resize handling

Prevent:

* unnecessary remounts
* state resets
* editor flicker

==================================================
SUBMISSION SYSTEM HARDENING
===========================

Audit:

* duplicate submissions
* pending state issues
* stale verdicts
* race conditions
* inconsistent solve states

Ensure:

* reliable verdict flow
* stable submission state
* proper async handling

==================================================
QUERY + CACHE OPTIMIZATION
==========================

Optimize:

* TanStack Query invalidation
* cache synchronization
* optimistic updates
* stale data handling
* unnecessary refetches

==================================================
STATE MANAGEMENT AUDIT
======================

Audit Zustand architecture for:

* unnecessary rerenders
* oversized stores
* stale closures
* duplicate state updates
* derived state inefficiencies

Refactor ONLY where necessary.

==================================================
ROUTE + ACCESS HARDENING
========================

Verify:

* locked problems cannot be bypassed
* inactive contests block submissions
* unauthorized users cannot access contests
* host-only controls are protected

==================================================
PERFORMANCE OPTIMIZATION
========================

Optimize for:

* minimal rerenders
* efficient realtime updates
* scalable participant rendering
* stable websocket throughput
* smooth contest dashboard rendering

==================================================
UX REFINEMENT PASS
==================

Improve:

* loading states
* skeleton states
* reconnect indicators
* empty states
* transition smoothness
* error handling
* fallback UI
* visual consistency

The platform should feel:

* smooth
* native
* reliable
* polished

==================================================
ERROR HANDLING
==============

Improve:

* websocket failure handling
* Supabase error handling
* async failure handling
* fallback recovery flows
* runtime crash prevention

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* reusable architecture
* strict typing
* modular cleanup
* clean separation of concerns
* maintainable realtime systems

==================================================
IMPORTANT
=========

Do NOT overengineer.
Do NOT massively refactor working systems.
Do NOT rebuild architecture unnecessarily.

Apply surgical production-grade stabilization improvements only.

==================================================
AT THE END
==========

Provide a complete audit report explaining:

* critical fixes applied
* synchronization improvements
* websocket hardening improvements
* performance optimizations
* remaining future risks
* production readiness assessment
* scalability readiness
