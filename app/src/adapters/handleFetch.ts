export const handleFetch = async (url: string, options = {}) => {
    try {
        const response = await fetch(url, options);
        const { ok, status, statusText, headers } = response;

        if (!ok) throw new Error(`Fetch failed with status — ${status}, ${statusText}`);

        return [(headers.get('content-type') || '').includes('application/json') ? response.json : response.text, null];
    } catch (error) {
        console.error(error);

        return [null, error];
    }
}
