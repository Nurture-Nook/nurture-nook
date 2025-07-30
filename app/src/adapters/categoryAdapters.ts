import {
    fetchHandler,
} from '../utils/fetch';
import { baseUrl } from './config';

export const getCategoryData = (category: object) => {
    return {
        name: category.title,
        description: category.categoryDescription,
        posts: category.posts
    }
}

export const getCategoryByName = async (name: string) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories?name=${encodeURIComponent(name)}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [getCategoryData(data.category), null];
}

export const getCategoryById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/categories/${id}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [getCategoryData(data.category), null];
}

export const fetchCategories = () => {
    const [data, error] = fetchHandler(baseUrl + `/categories`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.categories, null];
}
