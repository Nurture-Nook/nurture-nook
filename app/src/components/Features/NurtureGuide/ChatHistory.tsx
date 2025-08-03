import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { getChat } from "@/adapters/chatAdapters";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ScrollToBottomButton } from "./ScrollToBottomButton";
import { ChatDeleteButton } from "./ChatDeleteButton";
import { MessageOut } from "@/types/message";

export const ChatHistory = () => {
    const router = useRouter();
    const { chatId } = router.query;
    const [messages, setMessages] = useState<MessageOut[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages])

    useEffect(() => {
        if (!chatId) return;

        const fetchChatData = async () => {
            try {
                setLoading(true);
                const chatData: MessageOut[] = await getChat(Number(chatId));
                setMessages(chatData);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError("Failed to Load Chat");
                setLoading(false);
            }
        }

        fetchChatData();

        
    }, [])
    
    const handleNewMessage = (newMessage: MessageOut) => {
        setMessages((prev) => [...prev, newMessage]);
    }

    if (loading) return <div>Loading chat...</div>;
    if (error) return <div>{error}</div>
    
    return (
        <>
            <ChatDeleteButton />
            <div className="chat-history">
                <div ref={scrollRef} className="chat-messages">
                    
                    {messages.length === 0 && <p></p>};
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg}/>
                    ))};
                    
                    <ScrollToBottomButton scrollRef={scrollRef}/>

                    <ChatInput chat_id={Number(chatId)} sender="user" onNewMessage={handleNewMessage}/>
                </div>
            </div>
        </>
    )
}
