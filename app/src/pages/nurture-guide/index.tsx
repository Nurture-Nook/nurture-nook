import { useState } from "react";
import { useRouter } from "next/router";
import {
  getPostOptions,
  fetchHandler
} from '@/utils/fetch';

import { ChatCreateAPI, ChatOpen } from '@/types/chat';
import { MessageCreate } from '@/types/message';

const baseUrl = '/api/chat';

export default function NurtureGuideStart() {
  const [content, setContent] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!content.trim()) {
      setErrorText("Enter a Message to Begin.");
      return;
    }

    setLoading(true);

    const payload: ChatCreateAPI = {
      message: {
        sender: "user",
        content: content.trim(),
        chat_id: 0
      } as MessageCreate
    };

    try {
      const [newChat, error] = await fetchHandler(
        `${baseUrl}/chats/create`,
        getPostOptions(payload)
      ) as [ChatOpen, null];

      if (!newChat || error) {
        throw new Error("Failed to Create Chat");
      }

      router.push(`/nurture-guide/${newChat.id}`);
    } catch (err) {
      console.error("Failed to Start Chat: ", err);
      setErrorText("Could Not Start Chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Start a New Chat</h1>

      <form onSubmit={handleStart} >
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows={4}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Starting…" : "Start Chat"}
        </button>

        {errorText && (
          <p>{errorText}</p>
        )}
      </form>
    </div>
  );
}
