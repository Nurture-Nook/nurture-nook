import {
    basicFetchOptions,
    deleteOptions,
    fetchHandler,
    getPostOptions
} from '../utils/fetch';
import { ChatCreate } from '@/types/chat';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/chat`;

export const createChat = async (chatData: ChatCreate) => {
    return fetchHandler(
        `${baseUrl}/chats/create`,
        getPostOptions(chatData)
    );
}

export const getChat = async (chatId: number) => {
    return fetchHandler(
        `${baseUrl}/chats/${chatId}/messages`,
        basicFetchOptions
    );
}

export const deleteChat = async (chatId: number) => {
    return fetchHandler(
        `${baseUrl}/chats/${chatId}`,
        deleteOptions
    );
}
