import {
    basicFetchOptions,
    fetchHandler,
} from '../utils/fetch';

const baseUrl = '/api/category';

export const getCategoryByName = async (name: string) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories?name=${encodeURIComponent(name)}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data, null];
}

export const getCategoryById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories/${id}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data, null];
}

export const fetchCategories = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/categories`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.categories, null];
}
