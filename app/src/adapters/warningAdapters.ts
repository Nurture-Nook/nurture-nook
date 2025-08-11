import {
    basicFetchOptions,
    fetchHandler
} from '../utils/fetch';

const baseUrl = '/api/warning'

export const getWarningByName = async (name: string) => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings?name=${encodeURIComponent(name)}`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data, null];
}

export const getWarningById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings/${id}`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data, null];
}

export const fetchWarnings = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings`, basicFetchOptions);

    if (error) {
        console.error(error);
        return [null, error];
    }

    return [data.warnings, null];
}
