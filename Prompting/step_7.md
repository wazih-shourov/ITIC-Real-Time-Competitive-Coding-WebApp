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
* Contest creation/join system
* Contest lobby system
* Problem system
* Monaco editor workspace
* Contest start system
* Locked/unlocked problem access
* Contest timer foundation
* Discord-inspired desktop UI

IMPORTANT:
This platform has NO admin system.
Contest creators manage their own contests.

==================================================
STEP 7 GOAL
===========

Implement ONLY the Submission System Foundation.

This step is ONLY for:

* submission architecture
* submission saving
* submission history
* simulated verdict system
* problem solve tracking
* participant progress tracking
* submission UI foundation

==================================================
IMPORTANT
=========

DO NOT implement:

* real Docker judge
* secure sandbox execution
* real compiler infrastructure
* realtime leaderboard
* matchmaking
* battle system
* plagiarism detection
* websocket live rankings

Keep the implementation focused, modular, scalable, and production-grade.

==================================================
DATABASE REQUIREMENTS
=====================

Use Supabase.

If new tables are required:

* create proper SQL migration files
* place them inside supabase/migrations
* keep migrations modular and production-grade

Create scalable database architecture for:

* submissions
* participant problem progress

The schema must support future:

* real judge system
* test cases
* execution logs
* runtime/memory tracking
* leaderboard systems
* realtime contest ranking

WITHOUT requiring major refactors later.

==================================================
SUBMISSIONS TABLE REQUIREMENTS
==============================

Include scalable fields such as:

* id
* contest_id
* problem_id
* user_id
* language
* source_code
* verdict
* execution_time
* memory_used
* submitted_at
* created_at

Verdict values should support:

* pending
* accepted
* wrong_answer
* runtime_error
* time_limit_exceeded

==================================================
PARTICIPANT PROGRESS ARCHITECTURE
=================================

Track:

* solved problems
* attempted problems
* submission count
* first solve timestamps

Prepare architecture for future realtime leaderboards.

==================================================
SUBMISSION FLOW
===============

When participant clicks:
"Submit"

The system should:

1. validate contest state
2. validate problem access
3. save submission
4. create pending verdict state
5. process simulated judge result
6. update participant progress
7. refresh submission history
8. update problem solve state

==================================================
SIMULATED VERDICT SYSTEM
========================

IMPORTANT:
Do NOT build real execution infrastructure.

Instead implement a realistic simulated verdict system.

Examples:

* delayed async verdict processing
* mock judging queue
* deterministic fake verdicts
* lightweight validation simulation

The UX should FEEL like a real coding platform.

==================================================
PROBLEM STATUS TRACKING
=======================

Inside contests:
problems should visually become:

* solved
* attempted
* untouched

Update status automatically after submissions.

==================================================
SUBMISSION HISTORY UI
=====================

Create professional submission history UI.

Display:

* verdict
* language
* submission time
* execution time
* memory
* timestamps

Support:

* latest submissions
* scrollable history
* clean verdict badges

==================================================
WORKSPACE SUBMISSION PANEL
==========================

Inside coding workspace:
create a submission panel showing:

* latest verdict
* submission state
* pending processing
* submission history
* solve status

==================================================
VERDICT UX
==========

Implement polished verdict feedback.

Examples:

* Pending...
* Accepted
* Wrong Answer
* Runtime Error

Use:

* smooth transitions
* loading states
* professional animations

==================================================
STATE MANAGEMENT
================

Create scalable Zustand architecture for:

* submission state
* latest verdict
* participant progress
* workspace submission state

Avoid giant monolithic stores.

==================================================
QUERY ARCHITECTURE
==================

Use TanStack Query properly for:

* submission fetching
* submission history
* participant progress
* problem status synchronization

==================================================
PROBLEM ACCESS VALIDATION
=========================

Participants should ONLY submit if:

* contest is active
* problem is unlocked
* participant joined the contest

Implement proper frontend + backend validation.

==================================================
UI REQUIREMENTS
===============

Maintain the existing:

* Discord-inspired layout
* desktop-native feel
* dark professional aesthetic

Use:

* polished verdict cards
* elegant loading states
* smooth status updates
* competitive coding platform UX

==================================================
PERFORMANCE REQUIREMENTS
========================

Optimize for:

* minimal rerenders
* scalable submission rendering
* efficient history fetching
* stable async verdict processing

==================================================
CODE QUALITY
============

Requirements:

* production-grade TypeScript
* reusable architecture
* modular services
* proper typing everywhere
* scalable folder structure
* clean separation of concerns

==================================================
CREATE REUSABLE COMPONENTS
==========================

Create reusable components such as:

* SubmissionPanel
* SubmissionHistory
* VerdictBadge
* SubmissionCard
* ProblemSolveStatus
* WorkspaceSubmissionBar
* PendingSubmissionState
* ContestProgressIndicator

==================================================
IMPORTANT
=========

Do NOT overengineer.
Do NOT hallucinate future judge infrastructure.
Build ONLY the Submission System Foundation cleanly and professionally.

==================================================
AT THE END
==========

Explain:

* submission architecture
* simulated verdict flow
* participant progress system
* future real judge readiness
* scalability reasoning
* future realtime leaderboard compatibility
