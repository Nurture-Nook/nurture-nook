import { fetchHandler, basicFetchOptions, getPostOptions } from '../utils/fetch';

const baseUrl = '/api/post'

export const createPost = async (title: string, description: string, categories: number[], warnings: number[], user_id: number, parent_comment_id: number | null = null) => {
    const [data, error] = await fetchHandler(baseUrl + '/create', getPostOptions({title, description, categories, warnings, user_id, parent_comment_id}));

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.post, null];
}

export const getPostPreviewById = async (postId: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${encodeURIComponent(postId)}/preview`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.post, null];
}

export const getPostById = async (postId: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${encodeURIComponent(postId)}`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.post, null];
}

// export const getPostsBySearch = async (searchTerm: string, category = null, exclude = []) => {
//     let url = baseUrl + `/search?query=${encodeURIComponent(searchTerm)}`;

//     if (category !== null) url += `&category=${encodeURIComponent(category)}`;

//     if (exclude.length > 0) url += `&exclude=${exclude.map(encodeURIComponent).join(',')}`;

//     const [data, error] = await fetchHandler(url);

//     if (error) {
//         console.error(error);
//         return [null, error];
//     }

//     return [data.posts, null];
// }
