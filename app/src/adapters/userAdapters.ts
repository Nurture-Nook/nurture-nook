import {
    basicFetchOptions,
    fetchHandler,
    getPostOptions,
    getPatchOptions,
    deleteOptions // <-- import deleteOptions
} from '../utils/fetch';
import { UserPrivate } from '@/types/user';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/user/me`

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

    return [Array.isArray(data) ? data : [], null];
}

export const getCommentsByUser = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/comments`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [Array.isArray(data) ? data : [], null];
}

export async function updateProfile(data: UpdateProfilePayload): Promise<[null, string] | [UserPrivate, null]> {
    // Use PUT instead of PATCH
    const options = {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch("/api/user/me/update_profile", options);

        if (!response.ok) {
            const errorData = await response.json();
            return [null, errorData.detail || "Failed to Update Profile"];
        }

        const json = await response.json();
        return [json, null];
    } catch (err: Error | unknown) {
        if (err instanceof Error) return [null, err.message];
        return [null, "Network Error"]
    }
}

export const deleteProfile = async (payload: { password: string }) => {
    const options = {
        ...deleteOptions,
        headers: {
            ...deleteOptions.headers,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    };
    const [data, error] = await fetchHandler(
        `${baseUrl}/delete_account`,
        options
    );
    if (error) return [null, error];
    if (!data?.message) return [null, "Account Deletion Failed"];
    return [data, null];
};
