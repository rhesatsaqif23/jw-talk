import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";
import { Message } from "../types";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentRoom, setCurrentRoom] = useState<number | null>(null);

  // Ref untuk menyimpan interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fungsi untuk mengambil histori, di-wrap dengan useCallback agar stabil
  const fetchMessages = useCallback(async (roomId: number) => {
    try {
      const res = await api.get(`/chat/history?roomId=${roomId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil pesan", error);
    }
  }, []);

  useEffect(() => {
    // Bersihkan interval yang mungkin masih berjalan dari room sebelumnya
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (currentRoom) {
      const loadInitialMessages = async () => {
        await fetchMessages(currentRoom);
      };

      loadInitialMessages();

      // Buat interval untuk Short Polling (Auto-Refresh tiap 3 detik)
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(currentRoom);
      }, 2000);
    }

    // Cleanup saat komponen unmount atau saat currentRoom berubah
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [currentRoom, fetchMessages]);

  const joinRoom = useCallback((roomId: number) => {
    setCurrentRoom(roomId);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentRoom) return;

      try {
        await api.post("/chat/messages", {
          roomId: currentRoom,
          content: content,
        });

        // Ambil pesan terbaru segera setelah mengirim
        await fetchMessages(currentRoom);
      } catch (error) {
        console.error("Gagal mengirim pesan", error);
        alert("Gagal mengirim pesaSilakan coba lagi.");
      }
    },
    [currentRoom, fetchMessages],
  );

  const leaveRoom = useCallback(() => {
    setCurrentRoom(null);
    setMessages([]);
  }, []);

  return { currentRoom, messages, joinRoom, sendMessage, leaveRoom };
}
