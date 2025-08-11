import {
    basicFetchOptions,
    fetchHandler,
    deleteOptions
} from '../utils/fetch';

const baseUrl = '/api/me'

export const getPostsByUser = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/posts`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.posts ?? [], null];
}

export const getCommentsByUser = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/comments`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data?.comments ?? [], null];
}

export const deleteProfile = async () => {
    const [data, error] = await fetchHandler(`${baseUrl}/delete_account`, deleteOptions);
    
    if (error) return [null, error];
    
    if (!data?.success) return [null, "Account Deletion Failed"];
    
    return [data, null];
};
