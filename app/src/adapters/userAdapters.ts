import {
    basicFetchOptions,
    fetchHandler,
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
    const token = localStorage.getItem('auth_token');

    const options: RequestInit = {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
    };

    try {
        const response = await fetch(`${baseUrl}/update_profile`, options);

        if (!response.ok) {
            const errorData = await response.json();
            
            const errorMsg = Array.isArray(errorData.detail)
                ? errorData.detail.map((e: any) => e.msg).join(", ")
                : errorData.detail || "Failed to Update Profile";
        return [null, errorMsg];
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
