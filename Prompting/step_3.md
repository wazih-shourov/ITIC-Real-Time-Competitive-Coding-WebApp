You are a senior realtime systems engineer.

The project already has:
- React + Vite
- TypeScript
- TailwindCSS
- Zustand
- TanStack Query
- React Router
- Supabase authentication
- User profile system
- Persistent Discord-style layout

Now implement ONLY the foundational Socket.IO realtime architecture.

IMPORTANT:
Do NOT implement:
- contests
- battles
- matchmaking
- chat
- notifications
- presence system
- activity feed
- room systems

This step is ONLY for:
- websocket infrastructure
- socket connection architecture
- frontend socket integration

GOAL:
Create a clean scalable realtime foundation suitable for future multiplayer systems.

Requirements:

1. Create a standalone Node.js + Socket.IO server.

2. Configure proper TypeScript architecture for the realtime server.

3. Create frontend Socket.IO client integration.

4. Create reusable socket connection utilities.

5. Create a Zustand socket store for:
- connection state
- socket instance
- reconnect state

6. Implement:
- connect
- disconnect
- reconnect
- reconnect attempts

7. Display realtime connection status in the UI.

8. Create proper provider architecture for socket access.

9. Use environment variables properly.

10. Create scalable folder structure for future realtime features.

11. Add cleanup handling to avoid memory leaks.

12. Prevent duplicate socket connections.

13. Optimize for:
- minimal rerenders
- stable connections
- scalable realtime architecture

14. Add comments explaining important realtime architecture decisions.

15. At the end explain:
- frontend socket architecture
- backend socket architecture
- reconnection strategy
- scalability reasoning

Generate production-grade code only.
Avoid implementing extra features.
Avoid overengineering.
Focus ONLY on realtime socket foundation.