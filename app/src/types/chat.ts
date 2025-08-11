import { MessageInput, MessageOut } from "./message";

export interface ChatCreate {
    user_id: number;
    message: MessageInput;
}

export interface ChatOpen {
    id: number;
    started_at: string;
    messages: MessageOut[];
}
