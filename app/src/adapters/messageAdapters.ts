import {
    fetchHandler,
    getPostOptions,
    getPatchOptions
} from '../utils/fetch';

const baseUrl = '/api/message';

export const sendMessage = async ({
    sender, content, chatId
}: { sender: string; content: string; chatId: number; }) => {
    return fetchHandler(
        `${baseUrl}/create`,
        getPostOptions({ sender, content, chatId })
    );
}

export const editMessage = async ({
    id, content
}: { id: number; content: string}) => {
    return fetchHandler(
        `${baseUrl}/${id}/edit`,
        getPatchOptions({ content })
    );
}
