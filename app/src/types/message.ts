export interface MessageInput {
    chat_id?: number;
    sender: string;
    onNewMessage?: (newMessage: MessageOut) => void;
}

export interface MessageOut {
    id: number;
    sender: "user" | "ai";
    content: string;
    created_at: string
};

export interface MessageCreate {
  chat_id: number;
  sender: string;
  content: string;
}
