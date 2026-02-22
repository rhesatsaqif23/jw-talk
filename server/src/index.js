require("dotenv").config();

const http = require("http");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { Server } = require("socket.io");
const { signAccessToken, verifyAccessToken } = require("./auth");
const { authenticateToken } = require("./middleware/authenticateToken");
const { CLIENT_ORIGIN, PORT } = require("./config");

const prisma = new PrismaClient();
const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  if (existing) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  return res.status(201).json(user);
});

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const passwordValid = await bcrypt.compare(password, user.passwordHash);
  if (!passwordValid) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const accessToken = signAccessToken(user);
  return res.status(200).json({
    accessToken,
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

app.post("/auth/logout", authenticateToken, (_req, res) => {
  return res.status(200).json({ message: "Logged out successfully." });
});

app.get("/auth/me", authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.status(200).json(user);
});

app.get("/chat/history", authenticateToken, async (_req, res) => {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  return res.status(200).json(messages);
});

app.post("/chat/messages", authenticateToken, async (req, res) => {
  const { content } = req.body;

  if (!content || !String(content).trim()) {
    return res.status(400).json({ message: "Message content is required." });
  }

  const message = await prisma.message.create({
    data: {
      content: String(content).trim(),
      userId: req.user.id,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });

  io.emit("chat:message", message);
  return res.status(201).json(message);
});

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error." });
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error("Missing access token."));
  }

  try {
    const payload = verifyAccessToken(token);
    socket.user = {
      id: Number(payload.sub),
      username: payload.username,
    };
    return next();
  } catch (_err) {
    return next(new Error("Invalid access token."));
  }
});

io.on("connection", (socket) => {
  socket.emit("chat:connected", {
    user: socket.user,
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
