import { handleFetch } from './handleFetch.ts';
import { baseUrl } from './config.ts';

export const getCommentById = async (id: number) => {
    const [data, error] = await handleFetch(baseUrl + `/posts/postId/comments/${id}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comment];
}

export const getComments = async () => {
    const [data, error] = await handleFetch(baseUrl + `/posts/postId/comments`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comments, null];
}
