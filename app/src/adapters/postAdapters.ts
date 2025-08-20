import { fetchHandler, basicFetchOptions, getPostOptions, deleteOptions } from '../utils/fetch';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/post`

export const createPost = async (title: string, description: string, categories: number[], warnings: number[], user_id: number) => {
    try {
        console.log("Creating post with data:", {
            title, description, categories, warnings
        });
        
        const [data, error] = await fetchHandler(baseUrl + '/create', getPostOptions({
            title, 
            description, 
            categories, 
            warnings, 
            user_id
        }));

        if (error) {
            console.error("Error creating post:", error);
            return [null, error];
        }

        if (!data) {
            console.error("Invalid response format, missing post data:", data);
            return [null, new Error("Invalid response format from server")];
        }

        console.log("Post Created Successfully");
        return [data.post || data, null];
    } catch (err) {
        console.error("Exception in createPost Adapter:", err);
        return [null, err instanceof Error ? err : new Error("Unknown error creating post")];
    }
}

export const getPostPreviewById = async (postId: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${encodeURIComponent(postId)}/preview`, basicFetchOptions);

    if (error) {
        console.error("Error Fetching Post Preview:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid Response Format, Missing Post Data:", data);
        return [null, new Error("Invalid Response Format from Server")];
    }

    return [data.post || data, null];
}

export const getPostById = async (postId: number) => {
    try {
        if (!postId || isNaN(postId)) {
            console.error("Invalid postId:", postId);
            return [null, new Error("Invalid post ID")];
        }
        
        const [data, error] = await fetchHandler(baseUrl + `/posts/${encodeURIComponent(postId)}`, basicFetchOptions);

        if (error) {
            console.error("Error Fetching Post:", error);
            return [null, error];
        }

        if (!data) {
            console.error("Invalid Response Format, Missing Post Data");
            return [null, new Error("Invalid Response Format from Server")];
        }

        // Handle both direct response and nested response format
        const postData = data.post || data;
        console.log("Received Post Data");
        return [postData, null];
    } catch (err) {
        console.error("Exception in getPostById:", err);
        return [null, err instanceof Error ? err : new Error("Unknown Error Fetching Post")];
    }
}

export const deletePostById = async (postId: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/posts/${encodeURIComponent(postId)}`, deleteOptions);

    if (error) {
        console.error("Error Deleting Post:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid Response Format, Missing Deletion Result:", data);
        return [null, new Error("Invalid Response Format from Server")];
    }

    return [data.post || data, null];
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

//     return [data?.posts ?? [], null];
// }
