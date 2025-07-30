import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getChat } from "@/adapters/chatAdapters";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { MessageOut } from "@/types/message";

export const ChatHistory = () => {
    const router = useRouter();
    const { chatId } = router.query;
    const [messages, setMessages] = useState<MessageOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!chatId) return;

        const fetchChatData = async () => {
            try {
                setLoading(true);
                const chatData: MessageOut[] = await getChat(Number(chatId));
                setMessages(chatData);
                setLoading(false);
            } catch (error) {
                setError("Failed to Load Chat");
                setLoading(false);
            }
        }

        fetchChatData();

        
    })
    
    const handleNewMessage = (newMessage: MessageOut) => {
        setMessages((prev) => [...prev, newMessage]);
    }

    if (loading) return <div>Loading chat...</div>;
    if (error) return <div>{error}</div>
    
    return (
        <>
            <div className="chat-history">
                {messages.length === 0 && <p></p>};
                {messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg}/>
                ))};
                
                <ChatInput chat_id={Number(chatId)} sender="user" onNewMessage={handleNewMessage}/>
            </div>
        </>
    )
}
