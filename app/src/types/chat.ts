import { MessageInput, MessageCreate, MessageOut } from "./message";

export interface ChatCreate {
    message: MessageInput;
}

export interface ChatCreateAPI {
    message: MessageCreate;
}

export interface ChatOpen {
    id: number;
    started_at: string;
    messages: MessageOut[];
}
