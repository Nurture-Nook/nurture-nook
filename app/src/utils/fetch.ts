export const basicFetchOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
        "Accept": "application/json"
    }
};

export const deleteOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
    headers: {
        "Accept": "application/json"
    }
};

export const getPostOptions = (body: object): RequestInit => ({
    method: "POST",
    credentials: "include",
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(body),
});

export const getPatchOptions = (body: object): RequestInit => ({
    method: "PATCH",
    credentials: "include",
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    body: JSON.stringify(body),
});

export const fetchHandler = async (url: string, options: RequestInit = {}) => {
    try {
        console.log("Fetching URL:", url);
        console.log("With options:", JSON.stringify(options, null, 2));
        console.log("Current cookies:", document.cookie);
        
        // Ensure credentials are included for CORS
        const enhancedOptions: RequestInit = {
            ...options,
            credentials: 'include', // Always include credentials
            headers: {
                ...options.headers,
                // Add auth token from localStorage if available
                ...(localStorage.getItem('auth_token') ? {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                } : {})
            }
        };
        
        // Add timeout to fetch using AbortController
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const response = await fetch(url, {
            ...enhancedOptions,
            signal: controller.signal
        }).finally(() => {
            clearTimeout(timeoutId);
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", 
            [...response.headers.entries()].reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
        );
        const { ok, status, headers } = response;
        
        if (!ok) {
            const errorText = await response.text().catch(() => "Could not read error response");
            console.error(`Fetch failed with status - ${status}. Response:`, errorText);
            throw new Error(`Fetch failed with status - ${status}. ${errorText}`);
        }

        const isJson = (headers.get("content-type") || "").includes(
            "application/json"
        );
        const responseData = await (isJson ? response.json() : response.text());
        console.log("Response data:", responseData);

        return [responseData, null];
    } catch (error: unknown) {
        console.error("Fetch error:", error);
        
        // Provide more user-friendly error messages
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return [null, new Error('Request timed out. Please check if the server is running.')];
            } else if (error.message && error.message.includes('Failed to fetch')) {
                return [null, new Error('Connection failed. Please check if the server is running at the correct URL.')];
            }
            
            return [null, error];
        }
        
        return [null, new Error('An unknown error occurred')];
    }
};
