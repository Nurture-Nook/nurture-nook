import { fetchHandler, basicFetchOptions } from '../utils/fetch';
import { baseUrl } from './config';

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
