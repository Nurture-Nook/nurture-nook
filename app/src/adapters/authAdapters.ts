import {
    fetchHandler,
    getPostOptions,
} from '../utils/fetch';

const baseUrl = '/api/auth';

export const register = async ({
        username,
        email,
        password
    }: { username: string; email: string; password: string }) => {
    return fetchHandler(
        `${baseUrl}/register`,
        getPostOptions({ username, email, password })
    );
}

export const login = async ({ username, password }: { username: string; password: string }) => {
    return fetchHandler(
        `${baseUrl}/login`,
        getPostOptions({ username, password })
    );
}
