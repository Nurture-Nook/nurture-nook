import { handleFetch } from './handleFetch.ts';
import { baseUrl } from './config.ts';

export const getPostById = async (postId) => {
    const [data, error] = handleFetch(baseUrl + `/posts/${postId}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.post, null];
}

export const getPostsBySearch = async (searchTerm: string, category = null, exclude = []) => {
    let url = baseUrl + `/search?query=${encodeURIComponent(searchTerm)}`;

    if (category !== null) url += `&category=${encodeURIComponent(category)}`;

    if (exclude.length > 0) url += `&exclude=${exclude.map(encodeURIComponent).join(',')}`;

    const [data, error] = await handleFetch(url);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.posts, null];
}
