# JW-Talks Implementation Plan (Step-by-Step)

Dokumen ini memecah PRD JW-Talks menjadi langkah implementasi yang jelas untuk tim 4 orang agar bisa dieksekusi dalam 2–4 minggu.

## 0) Team Setup & Working Agreement

1. Tetapkan peran inti:
   - Backend lead (Express, Prisma, Socket.io)
   - Frontend lead (Next.js, UI/UX)
   - Fullstack engineer #1 (Auth integration, API contract)
   - Fullstack engineer #2 (Testing, deployment, docs)
2. Buat aturan kolaborasi:
   - Branching strategy (`main`, `develop`, feature branches)
   - Pull request template + definition of done
   - Daily sync 10–15 menit
3. Siapkan board manajemen tugas (GitHub Projects/Trello/Notion) dengan kolom: Backlog, In Progress, Review, Done.

## 1) Project Foundation (Day 1–3)

1. Finalisasi struktur monorepo saat ini:
   - `client/` untuk Next.js
   - `server/` untuk Express + Socket.io + Prisma
2. Tambahkan konfigurasi environment:
   - Server: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`
   - Client: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`
3. Setup quality tools:
   - TypeScript strict mode (client + server)
   - ESLint + Prettier + basic scripts (`lint`, `format`, `test`)
4. Setup Prisma baseline:
   - Define datasource PostgreSQL/Supabase
   - Generate Prisma Client
   - Create migration pipeline

Deliverable: aplikasi client/server bisa dijalankan lokal, koneksi DB sukses, CI lint minimum berjalan.

## 2) Data Model & API Contract (Day 2–4)

1. Definisikan schema database minimum:
   - `User`: `id`, `email` (unique), `passwordHash`, `createdAt`, `updatedAt`
   - `Message`: `id`, `userId`, `content`, `createdAt`
2. Tentukan API contract (OpenAPI sederhana atau markdown contract):
   - `POST /auth/register`
   - `POST /auth/login`
   - `POST /auth/logout` (opsional stateless, tapi endpoint tetap ada)
   - `GET /messages?limit=50`
   - `POST /messages`
   - `GET /auth/me`
3. Standarkan response format:
   - Sukses: `{ success: true, data: ... }`
   - Error: `{ success: false, error: { code, message } }`

Deliverable: dokumen kontrak API yang disepakati frontend-backend sebelum coding masif.

## 3) Authentication & Session Layer (Day 4–8)

1. Implement register:
   - Validasi email/password (minimal 8 karakter)
   - Hash password dengan bcrypt/argon2
   - Cegah duplikasi email
2. Implement login:
   - Verifikasi kredensial
   - Generate JWT berisi `userId` dan masa berlaku
3. Implement auth middleware server:
   - Ambil token dari `Authorization: Bearer <token>`
   - Verifikasi JWT per request terproteksi
4. Implement session management client:
   - Simpan token di `localStorage` atau `sessionStorage` (sesuai requirement)
   - Tambahkan helper untuk auto-attach token ke API request
5. Implement logout:
   - Hapus token dari web storage
   - Redirect ke halaman login

Deliverable: user hanya bisa akses halaman chat saat terautentikasi.

## 4) Chat Backend (REST + Socket.io) (Day 7–11)

1. Setup Socket.io server terintegrasi dengan Express.
2. Saat koneksi socket:
   - Validasi token sebelum join room global (`group:main`)
3. Implement alur kirim pesan:
   - REST `POST /messages` untuk persist ke DB
   - Emit event socket `message:new` ke semua user online
4. Implement history:
   - REST `GET /messages?limit=50` urut ascending by timestamp
5. Tambahkan handling disconnect/reconnect event.

Deliverable: backend dapat menyimpan dan broadcast pesan real-time secara aman.

## 5) Chat Frontend (Next.js) (Day 8–13)

1. Buat halaman:
   - `/login`, `/register`, `/chat`
2. Proteksi route:
   - Middleware/client guard agar `/chat` hanya untuk user login
3. UI chat:
   - List pesan scrollable
   - Input + tombol kirim (Enter to send)
   - State koneksi (`Connected`, `Reconnecting...`)
   - Tombol logout
4. Integrasi realtime:
   - Load initial history via REST
   - Subscribe `message:new` via socket
   - Optimistic UI saat kirim pesan
5. UX feedback:
   - Loading spinner untuk auth
   - Error message inline untuk login gagal/kirim gagal

Deliverable: pengalaman chat end-to-end dari login sampai logout berfungsi.

## 6) Security & Reliability Hardening (Day 12–15)

1. Validasi input server-side untuk semua endpoint.
2. Sanitasi pesan (minimal trim, max length, block empty content).
3. Tambahkan rate limit sederhana untuk auth endpoint.
4. Atur CORS hanya untuk origin client.
5. Tambahkan expiry handling:
   - Saat token expired, paksa logout + notifikasi user.

Deliverable: aplikasi lebih aman dan stabil untuk demo kelas.

## 7) Testing Strategy (Day 13–17)

1. Unit tests backend:
   - Auth service (hash, verify, token)
   - Message service validation
2. Integration tests API:
   - Register/login flow
   - Protected endpoint access
   - Message create/history
3. Basic E2E smoke test:
   - Register -> Login -> Send message -> Receive message -> Logout
4. Manual QA checklist untuk edge cases:
   - Wrong password
   - Token expired
   - Socket disconnect/reconnect

Deliverable: bukti pengujian untuk laporan dan mengurangi bug saat presentasi.

## 8) Observability & Metrics (Day 16–18)

1. Logging event penting:
   - Register success/fail
   - Login success/fail
   - Message sent
   - Socket connected/disconnected
2. Track success metrics PRD (minimal via logs + query DB):
   - Active users
   - Messages/user
   - Error rate auth/send
   - Basic latency pengiriman

Deliverable: data terukur untuk bagian evaluasi proyek.

## 9) Deployment & Demo Readiness (Day 18–20)

1. Deploy backend (Railway/Render/Fly/VM kampus).
2. Deploy frontend (Vercel).
3. Setup production database (Supabase Postgres).
4. Set environment variable production dengan aman.
5. Lakukan smoke test di environment deploy.

Deliverable: URL aplikasi live yang siap didemokan.

## 10) Documentation & Submission Package (Day 20+)

1. Lengkapi README proyek:
   - Arsitektur
   - Cara run lokal
   - API ringkas
   - Struktur folder
2. Buat laporan PDF sesuai ketentuan:
   - Nama + NIM anggota yang hadir
   - Penjelasan implementasi server-side, client-side, web storage, API
   - Screenshot login/chat/logout
   - Hasil uji & evaluasi
3. Siapkan script demo 5–10 menit untuk dosen.

Deliverable: paket akhir siap upload ke brone.ub.ac.id oleh ketua kelompok.

---

## Suggested Sprint Breakdown (2-Week Version)

- **Sprint 1 (Week 1):** Foundation + Auth + API contract + DB schema
- **Sprint 2 (Week 2):** Realtime chat + hardening + testing + docs

## Definition of Done (per fitur)

- Kode di-merge via PR review
- Lint/test minimal lulus
- Tidak ada blocker bug kritis
- Ada update dokumentasi
- Bisa didemokan end-to-end
