export interface MessageInput {
    chat_id?: number;
    user_id: number;
    sender: string;
    onNewMessage?: (newMessage: MessageOut) => void;
}

export interface MessageOut {
    id: number;
    sender: "user" | "ai";
    content: string;
    created_at: string;
};
