import { 
    basicFetchOptions,
    fetchHandler
} from '../utils/fetch';

const baseUrl = '/api';

export const getCommentById = async (id: number, comment_id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${id}/comments/${comment_id}`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comment, null];
}

export const getComments = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${id}/comments`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.comments, null];
}
