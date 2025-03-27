import { handleFetch } from './handleFetch.ts';
import { baseUrl } from './config.ts';

export const getCategoryData = (category: object) => {
    return {
        name: category.title,
        description: category.categoryDescription,
        posts: category.posts
    }
}

export const getCategoryByName = async (name: string) => {
    const [data, error] = await handleFetch(baseUrl + `/categories?name=${encodeUriComponent(name)}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [getCategoryData(data), null];
}

export const getCategoryById = async (id: number) => {
    const [data, error] = await handleFetch(baseUrl + `/categories/${id}`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [getCategoryData(data.category), null];
}

export const fetchCategories = () => {
    const [data, error] = handleFetch(baseUrl + `/categories`);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.categories, null];
}
