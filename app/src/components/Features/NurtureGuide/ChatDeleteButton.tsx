import { useState } from "react";
import { useRouter } from "next/router";
import { deleteChat } from "@/adapters/chatAdapters";

export const ChatDeleteButton = () => {
    const router = useRouter();
    const { chatId } = router.query;
    const [confirming, setConfirming] = useState(false);

    const handleDeleteClick = async () => {
        if (!confirming) {
            setConfirming(true);
            setTimeout(() => setConfirming(false), 5000);
        } else {
            await deleteChat(Number(chatId));
            router.push('/nurture-guide');
        }
    }

    return (
        <button onClick={ handleDeleteClick } className="delete-chat-button">
            {confirming ? "Conclude Guidance" : "Confirm Clear"};
        </button>
    )
}
