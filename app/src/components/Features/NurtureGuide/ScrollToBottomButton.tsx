import { useState, useEffect } from "react";

interface ScrollProps {
    scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ScrollToBottomButton: React.FC<ScrollProps> = ({ scrollRef }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 20;
            setVisible(!isAtBottom);
        }

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [scrollRef])

    const scrollToBottom = () => {
        const container = scrollRef.current;
        if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" })
    }

    if (!visible) return null;

    return (
        <button onClick={scrollToBottom} className="chat-scroll-button">Return to Active Guidance</button>
    );
}
