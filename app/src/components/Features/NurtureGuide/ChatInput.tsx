import { useState, useEffect } from 'react';

export const ChatInput = () => {
    const [errorText, setErrorText] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorText("");

        if (!message || message.trim().length === 0) return setErrorText("Input is Required");

        
    }
    
}