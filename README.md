# Collaborative Task Manager - Client

The frontend application for the Collaborative Task Manager, built with React, TypeScript, and Vite.

## 🚀 Features

- **Dashboard**: Interactive task board with filtering and sorting.
- **Real-time Updates**: Socket.io integration for instant task changes.
- **Optimistic UI**: Immediate feedback for smooth user experience.
- **Authentication**: Secure login/register flows.
- **Responsive Design**: Mobile-friendly dark theme using Tailwind CSS.

## 🛠️ Tech Stack

- **React**: UI library.
- **TypeScript**: Type safety.
- **Vite**: Fast development server and bundler.
- **Tailwind CSS**: Styling.
- **React Query**: Server state management.
- **Socket.io Client**: Real-time communication.

## 📦 Setup Instructions

1.  **Install Dependencies**
    ```bash
    cd client
    npm install
    ```

2.  **Configuration**
    - Create a `.env` file in the `client` directory:
      ```env
      VITE_BACKEND_URL=http://localhost:5000
      ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    - The app will run at `http://localhost:5173`.

## 🏗️ Architecture Overview

The client is designed with a layered architecture to ensure separation of concerns:

- **Service Layer**: All API communication is abstracted in `src/services` (e.g., `task.service.ts`). This decouples the UI components from the implementation details of HTTP requests (e.g., `fetch` vs `axios`).
- **Context API**: `AuthContext` manages the global user session state, checking for authentication via the `/auth/me` endpoint on initialization.
- **Server State Management**: **React Query** (`@tanstack/react-query`) is used for fetching, caching, and synchronizing server data. It handles loading states, error states, and automatic background refetching.

## 🔌 Socket.io Integration

Real-time functionality is key to the collaborative experience.

1.  **Initialization**: The socket connection is established in `src/services/socket.ts` and connected in the `Dashboard` component.
2.  **Event Listening**: The client listens for specific events:
    - `task_created` / `task_updated` / `task_deleted`: Triggers a React Query invalidation (`queryClient.invalidateQueries(['tasks'])`), causing the task list to refresh automatically.
    - `notification`: Displays real-time alerts when tasks are assigned.
3.  **Room Joining**: On login, the client emits `socket.emit('join', userId)` to join a private room for targeted notifications.

## ⚖️ Design Decisions & Trade-offs

- **Optimistic Updates**: For critical actions like **Task Deletion**, we implemented optimistic updates. The UI removes the task *immediately* upon user click, without waiting for the server response. This makes the app feel instant. If the server request fails, the change is rolled back.
  - *Trade-off*: In rare network failures, the item might reappear, but this is acceptable for the perceived performance gain.
- **Polling vs Sockets**: We chose **Socket.io** over polling for "push" updates, ensuring changes are reflected instantly across all clients without hammering the server with frequent "check" requests.
