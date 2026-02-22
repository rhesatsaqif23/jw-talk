import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "../lib/api";
import { getAccessToken } from "../lib/session";
import { Message } from "../types";

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useChat() {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<number | null>(null);

  // Inisialisasi Socket
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on("connect", () =>
      console.log("Socket connected:", newSocket.id),
    );

    newSocket.on("message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    newSocket.on("error_event", (err) => alert(err.message));

    socketRef.current = newSocket;

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = useCallback(async (roomId: number) => {
    if (!socketRef.current) return;

    try {
      // Fetch histori pesan via REST API sebelum join socket
      const res = await api.get(`/chat/history?roomId=${roomId}`);
      setMessages(res.data.data);

      // Join room via socket
      setCurrentRoom(roomId);
      socketRef.current.emit("join", { roomId });
    } catch (error) {
      console.error("Gagal join room", error);
    }
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !currentRoom) return;
      socketRef.current.emit("message", { roomId: currentRoom, content });
    },
    [currentRoom],
  );

  const leaveRoom = () => setCurrentRoom(null);

  return { currentRoom, messages, joinRoom, sendMessage, leaveRoom };
}
