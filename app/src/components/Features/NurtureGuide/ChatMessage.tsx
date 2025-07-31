import { MessageOut } from '@/types/message';

interface ChatMessageProps {
    message: MessageOut;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.sender === "user";

    return (
        <div className={`${isUser ? "user-message" : "ai-message"}`}>
            <div className='message-content'>{message.content}</div>
            <div className='message-time'>{message.created_at}</div>
        </div>
    ) 
}
