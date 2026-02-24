# 💬 JW-Talk

A real-time, secure group chat web application built with a modern decoupled client-server architecture. JW-Talk enables multiple users to communicate instantly across shared chat rooms with JWT-based authentication and WebSocket-powered messaging.

**[🚀 Live Demo](https://jw-talk.vercel.app/)** &nbsp;|&nbsp; **[📦 Repository](https://github.com/rhesatsaqif23/jw-talk)**

---

## ✨ Features

- **User Authentication** — Secure register, login, and logout with hashed passwords (bcrypt)
- **JWT Session Management** — Stateless token-based auth stored in `localStorage`, auto-injected via Axios Interceptors
- **Real-Time Group Chat** — Instant bidirectional messaging via Socket.io WebSockets
- **Room Management** — Create new rooms or join existing ones by Room ID
- **Chat History** — Persistent message history loaded from the database on room join
- **Route Protection** — Unauthenticated users are automatically redirected to the login page
- **Chronological Messages** — Messages displayed in order of timestamp with auto-scroll to latest
- **Race Condition Prevention** — Loading state on room creation prevents duplicate submissions

---

## 🛠️ Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) (App Router) | React framework, client-side rendering & routing |
| TypeScript | Type-safe client-side scripting |
| Axios | HTTP client with request interceptors for JWT injection |
| Socket.io Client | Real-time WebSocket communication |
| Context API | Global auth session management (`AuthContext`) |
| Custom Hooks | Isolated chat logic (`useChat`) |

### Backend (Server)
| Technology | Purpose |
|---|---|
| [Express.js](https://expressjs.com/) | RESTful API server |
| TypeScript | Type-safe server-side scripting |
| Socket.io | WebSocket server for real-time message broadcasting |
| JSON Web Token (JWT) | Stateless authentication tokens |
| bcrypt | Password hashing |
| [Prisma ORM](https://www.prisma.io/) | Database access layer |

### Database & Infrastructure
| Technology | Purpose |
|---|---|
| PostgreSQL (via [Supabase](https://supabase.com/)) | Cloud-hosted relational database |
| Vercel | Frontend deployment |

---

## 🏗️ Architecture

JW-Talk implements a **Decoupled Client-Server** architecture where the frontend and backend are developed and deployed independently, communicating via standard web protocols.

```
┌──────────────────────────────────────────────────────────┐
│                        CLIENT                            │
│  Next.js (App Router) + TypeScript                       │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │ AuthContext │  │  useChat.ts  │  │ Axios + api.ts │  │
│  │ (Session)   │  │  (Socket.io) │  │ (JWT Inject)   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          │     REST API   │    WebSocket     │  REST API
          │   (Auth/Room)  │  (Live Chat)     │  (Messages)
          ▼                ▼                  ▼
┌──────────────────────────────────────────────────────────┐
│                        SERVER                            │
│  Express.js + TypeScript + Socket.io                     │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Controller │  │   Services   │  │  Auth          │  │
│  │    Layer    │  │    Layer     │  │  Middleware     │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬────────┘  │
└─────────┼────────────────┼──────────────────┼───────────┘
          │                │                  │
          └────────────────▼──────────────────┘
                           │
                    Prisma ORM
                           │
                           ▼
                ┌──────────────────┐
                │   PostgreSQL     │
                │   (Supabase)     │
                └──────────────────┘
```

### Communication Protocols

- **REST API** — Used for stateful operations: `POST /api/auth/register`, `POST /api/auth/login`, room creation, and fetching message history
- **WebSocket (Socket.io)** — Used for real-time bidirectional chat; JWT is validated during the Socket.io handshake

---

## 🗄️ Database Schema

Three core models connected relationally:

```prisma
model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  name         String?
  passwordHash String
  socketId     String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  messages     Message[]
  rooms        Room[]    @relation("RoomParticipants")
}

model Room {
  id           Int       @id @default(autoincrement())
  name         String
  createdAt    DateTime  @default(now())
  messages     Message[]
  participants User[]    @relation("RoomParticipants")
}

model Message {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  userId    Int
  roomId    Int
  user      User     @relation(fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
}
```

---

## 🔐 Security

- **Password Hashing** — All passwords are hashed with `bcrypt` before storage; plaintext passwords are never persisted
- **JWT Authentication** — Tokens are issued on login and validated via `auth.middleware.ts` on every protected route
- **Axios Interceptors** — JWT is automatically attached to the `Authorization: Bearer` header on every API request from the client
- **Token Cleanup** — Tokens are cleared from `localStorage` on logout and on receiving a `401` response
- **WebSocket Auth** — JWT is validated during the Socket.io connection handshake, preventing unauthorized socket connections

> **Note on future improvements:** Migrating token storage from `localStorage` to `HttpOnly Cookies` would further mitigate XSS risks. Adding rate limiting middleware would help prevent DoS/spam scenarios.

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or yarn
- A PostgreSQL database (local or [Supabase](https://supabase.com/))

### 1. Clone the Repository

```bash
git clone https://github.com/rhesatsaqif23/jw-talk.git
cd jw-talk
```

### 2. Set Up the Server

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your_super_secret_jwt_key"
PORT=3001
CLIENT_URL="http://localhost:3000"
```

Run database migrations:

```bash
npx prisma migrate dev
npx prisma generate
```

Start the server:

```bash
npm run dev
```

### 3. Set Up the Client

```bash
cd ../client
npm install
```

Create a `.env.local` file in `/client`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

Start the client:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```
jw-talk/
├── client/                     # Next.js frontend
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   │   ├── login/      # Login page
│       │   │   └── register/   # Register page
│       │   └── chat/           # Chat dashboard page
│       ├── components/
│       │   ├── LeftPanel.tsx   # Room management UI
│       │   └── RightPanel.tsx  # Chat messages UI
│       ├── contexts/
│       │   └── AuthContext.tsx # Global session state
│       ├── hooks/
│       │   └── useChat.ts      # Socket.io chat logic
│       ├── lib/
│       │   ├── api.ts          # Axios instance + interceptors
│       │   └── session.ts      # localStorage token helpers
│       └── types/
│           └── index.ts
│
└── server/                     # Express.js backend
    ├── prisma/
    │   └── schema.prisma       # Database schema
    └── src/
        ├── controllers/
        │   ├── auth.controller.ts
        │   ├── room.controller.ts
        │   └── socket.controller.ts
        ├── middlewares/
        │   └── auth.middleware.ts  # JWT verification
        ├── routes/
        │   ├── auth.routes.ts
        │   └── chat.routes.ts
        ├── services/
        │   ├── auth.service.ts
        │   ├── message.service.ts
        │   ├── room.service.ts
        │   └── user.service.ts
        ├── lib/
        │   └── prisma.ts
        └── utils/
            └── response.ts
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/register` | Create a new user account | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |

### Chat

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/chat/rooms` | Create a new room | Yes |
| `POST` | `/api/chat/rooms/join` | Join a room by ID | Yes |
| `GET` | `/api/chat/rooms/:roomId/messages` | Fetch message history | Yes |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join a specific room channel |
| `send-message` | Client → Server | Send a message to the room |
| `receive-message` | Server → Client | Broadcast a new message to room members |
| `leave-room` | Client → Server | Leave the current room channel |

---

## 📖 Usage

1. **Register** — Create an account with your name, email, and password
2. **Login** — Sign in with your credentials; a JWT will be issued and stored locally
3. **Create or Join a Room** — Create a new room or enter an existing Room ID to join
4. **Chat** — Send messages and see all participants' messages update in real time
5. **Logout** — Click the Logout button to clear your session and disconnect

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing TypeScript conventions and that both client and server build without errors.

---

## 📬 Contact & Support

Found a bug or have a feature request? Please [open an issue](https://github.com/rhesatsaqif23/jw-talk/issues) on GitHub.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
