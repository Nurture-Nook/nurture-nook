import {
    fetchHandler,
    getPostOptions,
} from '../utils/fetch';

const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
console.log("API Base URL:", apiBase);
const baseUrl = `${apiBase}/auth`;

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
    // Try fetch with credentials first (for cookies)
    const [response, error] = await fetchHandler(
        `${baseUrl}/login`,
        getPostOptions({ username, password })
    );
    
    // Store username for debugging purposes
    localStorage.setItem('debug_username', username);
    
    // If login successful and we got a token in the response, store it in localStorage
    // as a fallback mechanism
    if (response && response.success && response.token) {
        console.log("Storing auth token in localStorage and cookie as fallback");
        localStorage.setItem('auth_token', response.token);
        
        // Also set a cookie manually
        document.cookie = `auth_token=${response.token};path=/;max-age=3600`;
        
        // Log what cookies we have after login
        console.log("Cookies after setting:", document.cookie);
    }
    
    return [response, error];
}

export const getCurrentUser = async () => {
    console.log("Getting current user from:", `${baseUrl}/me`);
    
    // Log cookies being sent
    console.log("Document cookies:", document.cookie);
    
    const headers: Record<string, string> = { 
        "Accept": "application/json",
        "Cache-Control": "no-cache" // Prevent caching issues
    };
    
    // Add token from localStorage if available
    const localStorageToken = localStorage.getItem('auth_token');
    if (localStorageToken) {
        console.log("Adding auth token from localStorage to Authorization header");
        headers["Authorization"] = `Bearer ${localStorageToken}`;
    }
    
    // Try direct auth method first
    console.log("Trying direct user fetch");
    
    // Get username from localStorage for debug
    const username = localStorage.getItem('debug_username');
    
    if (username) {
        try {
            // Try the direct endpoint
            const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
            const response = await fetch(
                `${apiBase}/get-user-by-username?username=${encodeURIComponent(username)}`,
                {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                }
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.user && data.token) {
                    console.log("Got user directly:", data.user);
                    
                    // Save the token for future use
                    localStorage.setItem('auth_token', data.token);
                    
                    return [data.user, null];
                }
            }
        } catch (e) {
            console.error("Error fetching user directly:", e);
        }
    }
    
    // Fallback to standard method
    console.log("Falling back to standard /auth/me endpoint");
    return fetchHandler(
        `${baseUrl}/me`,
        {
            method: "GET",
            credentials: "include",
            headers
        }
    );
}

export const logout = async () => {
    console.log("Logging out user");
    
    // Clear all stored credentials
    localStorage.removeItem('auth_token');
    localStorage.removeItem('debug_username');
    localStorage.removeItem('user_data');
    
    // Clear cookies
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    
    // Try to hit the logout endpoint on the backend
    try {
        const response = await fetch(`${baseUrl}/logout`, {
            method: "POST",
            credentials: "include"
        });
        
        return [{ success: true }, null];
    } catch (e) {
        console.error("Error logging out on server:", e);
        // Return success anyway since we've cleared local state
        return [{ success: true }, null];
    }
}
