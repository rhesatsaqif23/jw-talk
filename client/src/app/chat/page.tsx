"use client";
import { useState } from "react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/api";
import LeftPanel from "../../components/LeftPanel";
import RightPanel from "../../components/RightPanel";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const { currentRoom, messages, joinRoom, sendMessage, leaveRoom } = useChat();

  const [roomInput, setRoomInput] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [createRoomInput, setCreateRoomInput] = useState("");
  const [activeRoomName, setActiveRoomName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleJoinRoom = async (roomId: number) => {
    if (!roomId) return;
    joinRoom(roomId);
    try {
      const res = await api.get("/chat/rooms");
      const foundRoom = res.data.data.find((r: any) => r.id === roomId);
      setActiveRoomName(foundRoom ? foundRoom.name : "Unknown Room");
    } catch (error) {
      setActiveRoomName("Unknown Room");
    }
  };

  const handleCreateRoom = async () => {
    // Cegah eksekusi jika input kosong atau sedang proses loading
    if (!createRoomInput.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await api.post("/chat/rooms", { name: createRoomInput });
      const newRoom = res.data.data;
      joinRoom(newRoom.id);
      setActiveRoomName(newRoom.name);
      setCreateRoomInput("");
    } catch (error: any) {
      alert(error.response?.data?.error?.message || "Gagal membuat Room");
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-primary-light flex items-center justify-center p-6">
      <div className="flex gap-6 w-full max-w-6xl h-[85vh]">
        <LeftPanel
          user={user}
          logout={logout}
          roomInput={roomInput}
          setRoomInput={setRoomInput}
          handleJoinRoom={handleJoinRoom}
          createRoomInput={createRoomInput}
          setCreateRoomInput={setCreateRoomInput}
          handleCreateRoom={handleCreateRoom}
          isCreating={isCreating}
        />

        <RightPanel
          user={user}
          currentRoom={currentRoom}
          activeRoomName={activeRoomName}
          leaveRoom={leaveRoom}
          messages={messages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
