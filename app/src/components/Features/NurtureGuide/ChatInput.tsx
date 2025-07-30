import { useState } from 'react';
import { sendMessage } from '@/adapters/messageAdapters';
import { MessageInput } from '@/types/message';

export const ChatInput: React.FC<MessageInput> = ({ chat_id, sender }) => {
    const [errorText, setErrorText] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorText("");

        if (!content || !content.trim()) return setErrorText("Input is Required");

        setLoading(true);

        try {
            await sendMessage({sender, content, chat_id});
        } catch (error) {
            setErrorText("Failed to Send Message");
            console.error("Failed to send message: ", error);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <>
            <p>{errorText}</p>
            
            <form onSubmit={handleSubmit} className="chat-input">
                <input
                    type="text"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="type your message..."
                    disabled={loading}
                    className="input-field"
                />
                <button type="submit" disabled={loading || !content.trim()} className="send-button">
                    Send
                </button>
            </form>
        </>
    )
}
