import {
    basicFetchOptions,
    fetchHandler,
    deleteOptions,
    getPatchOptions
} from '../utils/fetch';

const baseUrl = '/api/me'

interface UpdateProfilePayload {
    new_username?: string;
    new_email?: string;
    current_password?: string;
    new_password?: string;
}

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

export async function updateProfile(data: UpdateProfilePayload): Promise<[null, string] | [any, null]> {
    const options = getPatchOptions(data);

    try {
        const response = await fetch("/api/me/update_profile", options);

        if (!response.ok) {
            const errorData = await response.json();
            return [null, errorData.detail || "Failed to Update Profile"];
        }

        const json = await response.json();
        return [json, null];
    } catch (err: any) {
        return [null, err.message || "Network Error"];
    }
}

export const deleteProfile = async () => {
    const [data, error] = await fetchHandler(`${baseUrl}/delete_account`, deleteOptions);
    
    if (error) return [null, error];
    
    if (!data?.success) return [null, "Account Deletion Failed"];
    
    return [data, null];
};
