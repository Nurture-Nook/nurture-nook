import {
    fetchHandler,
    getPostOptions,
    getPatchOptions
} from '../utils/fetch';

const baseUrl = '/api/message';

export const sendMessage = async ({
    sender, content, chat_id, user_id
}: { sender: string; content: string; chat_id: number | undefined; user_id: number }) => {
    return fetchHandler(
        `${baseUrl}/create`,
        getPostOptions({ sender, content, chat_id, user_id })
    );
}

export const editMessage = async ({
    id, content
}: { id: number; content: string}) => {
    return fetchHandler(
        `${baseUrl}/messages/${id}/edit`,
        getPatchOptions({ content })
    );
}
