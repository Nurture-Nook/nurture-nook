export interface MessageInput {
    chatId: number;
    sender: string;
}

export interface MessageOut {
    id: number;
    sender: "user" | "ai";
    content: string;
    created_at: string
};
