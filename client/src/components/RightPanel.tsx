"use client";

import { useEffect, useRef } from "react";

interface RightPanelProps {
  user: any;
  currentRoom: number | null;
  activeRoomName: string;
  leaveRoom: () => void;
  messages: any[];
  messageInput: string;
  setMessageInput: (val: string) => void;
  sendMessage: (msg: string) => void;
}

export default function RightPanel({
  user,
  currentRoom,
  activeRoomName,
  leaveRoom,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
}: RightPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk scroll otomatis ke elemen referensi
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Panggil fungsi scroll setiap kali array 'messages' berubah
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Jika belum masuk room, render empty state
  if (!currentRoom) {
    return (
      <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center border border-blue-100">
        <div className="w-20 h-20 bg-primary-light text-primary-main rounded-full flex items-center justify-center mb-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
        </div>
        <p className="text-text-main font-semibold text-xl mb-2">
          Belum masuk ke Room mana pun
        </p>
        <p className="text-text-muted text-[14px] max-w-sm">
          Buat room baru atau masukkan Room ID di panel sebelah kiri untuk mulai
          mengobrol dengan teman-temanmu.
        </p>
      </div>
    );
  }

  // Jika sudah masuk room
  return (
    <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col relative border border-blue-100 overflow-hidden min-w-0">
      {/* Header Room */}
      <div className="flex justify-between items-center p-6 border-b border-blue-50 bg-primary-light/30">
        <div className="min-w-0 pr-4">
          <h2 className="text-xl font-bold text-text-main truncate">
            {activeRoomName}
          </h2>
          <p className="text-sm font-medium text-text-muted mt-1 bg-white px-2 py-0.5 rounded border border-blue-100 inline-block">
            Room ID: {currentRoom}
          </p>
        </div>
        <button
          onClick={leaveRoom}
          className="bg-white border border-blue-200 hover:bg-blue-50 transition-colors text-text-muted hover:text-danger-main font-medium px-4 py-2 rounded-lg text-[14px] shadow-sm shrink-0"
        >
          Leave Room
        </button>
      </div>

      {/* Area Chat */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent bg-gray-50/30">
        {messages.map((msg) => {
          const isMe = msg.userId === user.id;
          const time = new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] p-3.5 rounded-2xl shadow-sm flex flex-col ${
                  isMe
                    ? "bg-primary-main text-white rounded-tr-sm"
                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                }`}
              >
                <p
                  className={`text-[12px] font-bold mb-1 ${
                    isMe ? "text-blue-200" : "text-primary-main"
                  }`}
                >
                  {isMe ? "Anda" : msg.user?.name || `User ${msg.userId}`}
                </p>
                <p className="text-[14px] leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {msg.content}
                </p>
                <p
                  className={`text-xs self-end mt-1 ${
                    isMe ? "text-blue-200" : "text-text-muted"
                  }`}
                >
                  {time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t border-blue-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (messageInput.trim()) {
              sendMessage(messageInput);
              setMessageInput("");
            }
          }}
          className="flex gap-3"
        >
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 p-3.5 rounded-xl bg-primary-light border border-blue-100 outline-none text-gray-800 placeholder-text-muted text-[14px] focus:ring-2 focus:ring-primary-main focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-primary-main hover:bg-primary-hover disabled:bg-blue-300 transition-colors text-white px-8 rounded-xl font-semibold shadow-sm shrink-0"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
}
