"use client";

import { useState } from "react";

export default function ChatPage() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomInput, setRoomInput] = useState("");
  const [message, setMessage] = useState("");
  const [createRoomInput, setCreateRoomInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      user: "Bagas",
      text: "haloooooooooooooooooooooooooooooooooooo",
      time: "12:24 PM",
      isMe: false,
    },
    {
      id: 2,
      user: "Johan",
      text: "halooo",
      time: "12:26 PM",
      isMe: false,
    },
    {
      id: 3,
      user: "Username",
      text: "halooo",
      time: "12:27 PM",
      isMe: true,
    },
  ]);

  const handleJoinRoom = () => {
    if (!roomInput.trim()) return;
    setCurrentRoom(roomInput);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: "Username",
      text: message,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center p-6">
      <div className="flex gap-6 w-full max-w-6xl">

        {/* LEFT PANEL */}
        <div className="w-80 bg-gray-100 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-bold text-blue-600 mb-6">
            Halo, Username!
          </h2>

          {/* JOIN ROOM */}
          <div className="mb-6">
            <h3 className="font-semibold text-blue-600 mb-2">
              Join Room
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room ID (Misal: 1)"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-blue-100 outline-none text-blue-800"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                Join
              </button>
            </div>
          </div>

          {/* CREATE ROOM */}
        <div>
        <h3 className="font-semibold text-blue-600 mb-2">
            Create Room
        </h3>

        <div className="flex gap-2">
            <input
            type="text"
            placeholder="Room Name"
            value={createRoomInput}
            onChange={(e) => setCreateRoomInput(e.target.value)}
            className="min-w-0 flex-1 p-2 rounded-lg bg-blue-100 outline-none text-blue-800"
            />

            <button
            onClick={() => {
                if (!createRoomInput.trim()) return;
                setCurrentRoom(createRoomInput);
                setCreateRoomInput("");
            }}
            className="bg-blue-600 text-white px-4 rounded-lg"
            >
            Create
            </button>
        </div>
        </div>
        </div>

        {/* RIGHT PANEL */}
        {currentRoom && (
          <div className="flex-1 bg-gray-100 rounded-xl p-6 shadow-md flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-600">
                Live Chat - Room ID: {currentRoom}
              </h2>

              <button
                onClick={() => setCurrentRoom(null)}
                className="text-white bg-blue-600 w-8 h-8 rounded-full"
              >
                X
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">

              <div className="text-center text-blue-400 text-sm">
                --- Bergabung ke Room {currentRoom} ---
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.isMe
                        ? "bg-blue-400 text-white"
                        : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    <p className="text-sm font-semibold">
                      {msg.user}:
                    </p>
                    <p className="text-sm break-words">
                      {msg.text}
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT AREA */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ketik pesan..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-blue-100 outline-none text-blue-800"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                Kirim
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}