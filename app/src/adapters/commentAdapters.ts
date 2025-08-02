import { fetchHandler } from '../utils/fetch';
import { baseUrl } from './config';

export const getCommentById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/postId/comments/${id}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comment, null];
}

export const getComments = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/postId/comments`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comments, null];
}
