import { 
    basicFetchOptions,
    fetchHandler,
    getPostOptions,
    deleteOptions
} from '../utils/fetch';
import { CommentOut } from '@/types/comment';

const baseUrl = '/api';

export const createComment = async (
    content: string,
    warnings: number[],
    user_id: number,
    post_id: number,
    parent_comment_id: number | null = null
) => {
    const [data, error] = await fetchHandler(
        baseUrl + `/post/${post_id}/comments/create`, 
        getPostOptions({content, warnings, user_id, post_id, parent_comment_id})
    );

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.comment ?? [], null];
}

export const getCommentById = async (id: number, comment_id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/post/posts/${id}/comments/${comment_id}`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.comment ?? [], null];
}

export const getComments = async (id: number) => {
    const [data, error] = await fetchHandler(
        baseUrl + `/post/posts/${id}/comments`, 
        basicFetchOptions
    );

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.comments ?? [], null];
}

export const getCommentsByIds = async (postId: number, commentIds: number[]): Promise<[CommentOut[], string | null]> => {
    try {
        const results = await Promise.all(commentIds.map(id => getCommentById(postId, id)));

        const comments: CommentOut[] = [];
        for (const [comment, error] of results) {
            if (error) return [[], error];
            if (comment) comments.push(comment);
        }

        return [comments, null];
    } catch (err) {
        console.error(err);
        return [[], 'Failed to Fetch Comments'];
    }
};

export const deleteCommentById = async (postId: number, commentId: number) => {
    const [data, error] = await fetchHandler(
        baseUrl + `/posts/${encodeURIComponent(postId)}/comments/${commentId}`, deleteOptions
    );

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.post ?? [], null];
}
