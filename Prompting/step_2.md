You are a senior staff-level full-stack architect building a production-grade realtime coding battle platform.

The existing project already uses:
- React
- Vite
- TypeScript
- TailwindCSS
- Framer Motion
- Zustand
- TanStack Query
- React Router
- Supabase
- Socket.IO preparation

The application already has:
- Discord-inspired persistent desktop layout
- scalable frontend architecture
- sidebar navigation
- placeholder pages
- app-shell structure

Now implement the COMPLETE authentication and user system architecture.

IMPORTANT:
This must feel like a polished native desktop application.
Everything should feel instant, smooth, modern, and production-grade.

IMPORTANT:
DO NOT implement:
- contests
- battles
- matchmaking
- judge system
- admin HQ
- websocket realtime logic
- chat system

This step is ONLY for:
- authentication
- session architecture
- user profile system
- protected routes
- onboarding flow

==================================================
CORE GOAL
==================================================

Build a scalable authentication architecture suitable for a large realtime multiplayer platform.

The implementation must be:
- highly optimized
- cleanly architected
- scalable
- minimal rerender
- smooth UX
- future-proof for websocket identity integration

==================================================
SUPABASE REQUIREMENTS
==================================================

Use Supabase as the ONLY backend.

Implement:
- Supabase Auth
- Supabase profile system
- Row Level Security preparation
- session persistence
- auth-aware routing

==================================================
AUTH FEATURES
==================================================

Implement:
- Email/password/confirm password signup
- Email/password login
- Logout
- Session persistence
- Instant session restoration
- Protected routes
- Public/private route separation
- Remember authenticated user state globally

==================================================
PROFILE SYSTEM
==================================================

Create a scalable user profile architecture.

Create Supabase profiles table structure with:
- id
- username
- avatar_url
- bio
- rating
- created_at
- updated_at

After signup:
Automatically create a user profile.

==================================================
ONBOARDING FLOW
==================================================

After successful signup:
Redirect user into onboarding flow.

Onboarding includes:
- username selection
- optional avatar upload
- optional bio

After onboarding:
Redirect to dashboard.

==================================================
ROUTE ARCHITECTURE
==================================================

Create proper route structure:

Public Routes:
- /login
- /signup

Protected Routes:
- /dashboard
- /contests
- /battles
- /rankings
- /settings

Use proper protected layout architecture.

==================================================
UI REQUIREMENTS
==================================================

UI must match the existing desktop-native aesthetic.

Style inspiration:
- Discord
- Linear
- Cursor

Requirements:
- polished dark-first UI
- smooth transitions
- instant navigation feel
- zero layout flashing
- responsive desktop experience
- subtle hover animations
- modern glass/pro-tool feeling

==================================================
ANIMATION REQUIREMENTS
==================================================

Use Framer Motion carefully for:
- page transitions
- auth form transitions
- loading states
- hover interactions
- onboarding flow animations

Animations must remain:
- subtle
- GPU accelerated
- performant
- native-feeling

==================================================
STATE MANAGEMENT
==================================================

Create proper Zustand store architecture for:
- auth state
- session state
- user state
- onboarding state

Avoid giant monolithic stores.

Use scalable modular architecture.

==================================================
QUERY ARCHITECTURE
==================================================

Use TanStack Query properly for:
- profile fetching
- session-aware queries
- optimistic updates
- cache synchronization

==================================================
SUPABASE CLIENT ARCHITECTURE
==================================================

Create scalable Supabase structure:
- browser client
- auth utilities
- session utilities
- profile utilities

Prepare architecture for future realtime websocket identity integration.

==================================================
LOADING EXPERIENCE
==================================================

VERY IMPORTANT:

Avoid:
- auth flashing
- white screens
- delayed session restoration
- visible route jumping

Implement:
- smooth loading skeletons
- session hydration handling
- app-ready states
- persistent layouts during auth checks

==================================================
ERROR HANDLING
==================================================

Create clean error handling for:
- invalid credentials
- duplicate accounts
- network failures
- session expiration

Add polished toast notifications.

==================================================
CODE QUALITY
==================================================

Requirements:
- production-grade TypeScript
- scalable folder organization
- reusable components
- clean separation of concerns
- minimal rerenders
- proper hooks architecture
- proper typing everywhere

==================================================
CREATE REUSABLE COMPONENTS
==================================================

Create reusable components such as:
- AuthForm
- AuthInput
- PasswordInput
- UserAvatar
- ProfileCard
- AuthGuard
- LoadingScreen
- ProtectedLayout
- OnboardingModal

==================================================
IMPORTANT PERFORMANCE REQUIREMENTS
==================================================

Optimize for:
- instant auth restoration
- minimal unnecessary rerenders
- fast route transitions
- persistent app-shell experience
- native desktop-app feel


supabase Credential: 
supabase Project URL: https://eitcoktfplxsarjvxcau.supabase.co
supabase ANON Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdGNva3RmcGx4c2FyanZ4Y2F1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjI0NTIsImV4cCI6MjA5MzgzODQ1Mn0.2BC7Ny1AkFkWc48HLDeqKMRrLLpbuRBUJMTOwyX2ZC4
supabase service role: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpdGNva3RmcGx4c2FyanZ4Y2F1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODI2MjQ1MiwiZXhwIjoyMDkzODM4NDUyfQ.rzC2bQQAbuIgGMMpLJGgIrIQUePNbK0USHNAlOdl27k


Note: Keep all sql file in one folder organized

==================================================
AT THE END
==================================================

Explain:
- auth architecture
- Supabase integration strategy
- protected route system
- Zustand structure
- query architecture
- performance optimizations
- scalability reasoning

Generate production-grade code only.
Avoid beginner architecture.
Avoid unnecessary complexity.
Avoid overengineering.
Focus on clean scalable realtime-app architecture.