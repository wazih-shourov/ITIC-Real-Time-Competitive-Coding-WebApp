# ITIC Real-Time Competitive Coding WebApp

A comprehensive real-time competitive programming platform designed for organizing coding contests, practice battles, and collaborative problem-solving.

## 🚀 Features

-   **Real-Time Battles:** Engage in live coding competitions with instant leaderboard updates.
-   **Collaborative Workspace:** Integrated Monaco Editor with real-time sync and code review capabilities.
-   **Contest Management:** Create, manage, and join contests with invite codes.
-   **Automated Submissions:** Robust submission system with verdict badges and history.
-   **Live Feed:** Real-time solve feed and participant presence tracking.
-   **Comprehensive Dashboard:** Track rankings, activity, and personal progress.

## 🛠️ Tech Stack

### Frontend
-   **Framework:** React 19 (TypeScript)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS, Framer Motion (Animations)
-   **State Management:** Zustand
-   **Icons:** Lucide React
-   **Real-time:** Socket.io-client
-   **Backend-as-a-Service:** Supabase (Auth, Database, Storage)
-   **Editor:** Monaco Editor (@monaco-editor/react)

### Backend
-   **Runtime:** Node.js
-   **Framework:** Express (TypeScript)
-   **Real-time:** Socket.io
-   **Database Integration:** Supabase SDK
-   **Authentication:** JWT (Middleware)

## 📂 Project Structure

```text
ITIC Club/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # UI Components (Core, Features, Layout)
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Service integrations (Supabase, Sockets)
│   │   ├── pages/        # Application views
│   │   ├── store/        # Zustand stores
│   │   └── types/        # TypeScript definitions
│   └── supabase/         # Database migrations
├── server/               # Node.js backend
│   ├── src/
│   │   ├── handlers/     # Socket.io event handlers
│   │   ├── middleware/   # Auth and utility middlewares
│   │   └── index.ts      # Server entry point
└── Prompting/            # Development roadmap and step-by-step documentation
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Supabase Account

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/wazih-shourov/ITIC-Real-Time-Competitive-Coding-WebApp.git
    cd ITIC-Real-Time-Competitive-Coding-WebApp
    ```

2.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    # Create .env and add Supabase credentials
    cp .env.example .env
    npm run dev
    ```

3.  **Server Setup:**
    ```bash
    cd ../server
    npm install
    # Create .env and add required environment variables
    npm run dev
    ```

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
