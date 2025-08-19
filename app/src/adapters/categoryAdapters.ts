import {
    basicFetchOptions,
    fetchHandler,
} from '../utils/fetch';

const apiBase = '/api';
const baseUrl = `${apiBase}/category`;

export const getCategoryByName = async (name: string) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories?name=${encodeURIComponent(name)}`);

    if (error) {
        console.error("Error fetching category by name:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid response format, missing category data:", data);
        return [null, new Error("Invalid response format from server")];
    }

    if (Array.isArray(data) && data.length > 0) {
        return [data[0], null];
    }

    return [data, null];
}

export const getCategoryById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories/${id}`);

    if (error) {
        console.error("Error fetching category by ID:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid response format, missing category data:", data);
        return [null, new Error("Invalid response format from server")];
    }

    return [data, null];
}

export const fetchCategories = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/categories`, basicFetchOptions);

    if (error) {
        console.error("Error fetching categories:", error);
        return [null, error];
    }

    if (!data || !data.categories) {
        console.error("Invalid response format, missing categories:", data);
        return [null, new Error("Invalid response format from server")];
    }

    return [data.categories, null];
}
