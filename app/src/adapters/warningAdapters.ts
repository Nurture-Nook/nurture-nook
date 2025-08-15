import {
    basicFetchOptions,
    fetchHandler
} from '../utils/fetch';

const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE}/warning`

export const getWarningByName = async (name: string) => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings?name=${encodeURIComponent(name)}`, basicFetchOptions);

    if (error) {
        console.error("Error fetching warning by name:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid response format, missing warning data:", data);
        return [null, new Error("Invalid response format from server")];
    }

    if (Array.isArray(data) && data.length > 0) {
        return [data[0], null];
    }

    return [data, null];
}

export const getWarningById = async (id: number) => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings/${id}`, basicFetchOptions);

    if (error) {
        console.error("Error fetching warning by ID:", error);
        return [null, error];
    }

    if (!data) {
        console.error("Invalid response format, missing warning data:", data);
        return [null, new Error("Invalid response format from server")];
    }

    return [data, null];
}

export const fetchWarnings = async () => {
    const [data, error] = await fetchHandler(baseUrl + `/warnings`, basicFetchOptions);

    if (error) {
        console.error("Error fetching warnings:", error);
        return [null, error];
    }

    if (!data || !data.warnings) {
        console.error("Invalid response format, missing warnings:", data);
        return [null, new Error("Invalid response format from server")];
    }

    return [data.warnings, null];
}
