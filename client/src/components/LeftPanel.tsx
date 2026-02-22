"use client";

interface LeftPanelProps {
  user: any;
  logout: () => void;
  roomInput: string;
  setRoomInput: (val: string) => void;
  handleJoinRoom: (id: number) => void;
  createRoomInput: string;
  setCreateRoomInput: (val: string) => void;
  handleCreateRoom: () => void;
  isCreating: boolean;
}

export default function LeftPanel({
  user,
  logout,
  roomInput,
  setRoomInput,
  handleJoinRoom,
  createRoomInput,
  setCreateRoomInput,
  handleCreateRoom,
  isCreating,
}: LeftPanelProps) {
  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl p-6 shadow-sm flex flex-col shrink-0">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary-light">
        <h2 className="text-xl font-bold text-primary-main truncate pr-2">
          Halo, {user.name || user.email}!
        </h2>
        <button
          onClick={logout}
          className="text-sm bg-danger-main hover:bg-danger-hover transition-colors text-white px-3 py-1.5 rounded-lg shadow-sm shrink-0 font-medium"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-2 scrollbar-thin scrollbar-thumb-primary-light scrollbar-track-transparent">
        <div className="mb-6">
          <h3 className="font-semibold text-primary-main mb-3 text-sm">
            Join Room by ID
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="number"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="Masukkan Room ID"
              className="w-full p-3 rounded-xl bg-primary-light outline-none text-text-main placeholder-primary-main/60 text-sm focus:ring-2 focus:ring-primary-hover transition-all"
            />
            <button
              onClick={() => {
                if (roomInput.trim()) {
                  handleJoinRoom(Number(roomInput));
                  setRoomInput("");
                }
              }}
              className="w-full bg-primary-main hover:bg-primary-hover transition-colors text-white py-3 rounded-xl font-semibold text-sm shadow-sm"
            >
              Join Room
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-primary-light mb-6"></div>

        <div className="mb-2">
          <h3 className="font-semibold text-primary-main mb-3 text-sm">
            Create New Room
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={createRoomInput}
              onChange={(e) => setCreateRoomInput(e.target.value)}
              placeholder="Room Name"
              className="w-full p-3 rounded-xl bg-primary-light outline-none text-text-main placeholder-primary-main/60 text-sm focus:ring-2 focus:ring-primary-hover transition-all"
            />
            <button
              onClick={handleCreateRoom}
              disabled={!createRoomInput.trim() || isCreating}
              className="w-full bg-primary-main hover:bg-primary-hover disabled:opacity-50 transition-colors text-white py-3 rounded-xl font-semibold text-sm shadow-sm"
            >
              {isCreating ? "Creating..." : "Create Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
