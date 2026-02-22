export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  roomId: number;
  user?: {
    id: number;
    name: string;
  };
}

export interface Room {
  id: number;
  name: string;
}
