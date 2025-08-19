import { fetchHandler } from '../utils/fetch';

const apiBase = '/api';  // Use the proxy path instead of direct URL
console.log("API Base URL:", apiBase);
const baseUrl = `${apiBase}/auth`;

// Helper to handle common fetch options
const getPostOptions = (body: any) => ({
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
});

export const register = async ({
        username,
        email,
        password
    }: { username: string; email: string; password: string }) => {
    const [data, error] = await fetchHandler(
        `${baseUrl}/register`,
        getPostOptions({ username, email, password })
    );
    
    if (data && data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
    }
    
    return [data, error];
}

export const login = async ({ username, password }: { username: string; password: string }) => {
    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password }),
            credentials: "include", // Include cookies in the request
            mode: "cors" // Explicitly request CORS mode
        });
        
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }
        
        const data = await response.json();

        data.success = data.message === "Login Successful";
        
        // Store token in localStorage
        if (data.access_token) {
            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            console.log("Saved token and user data to localStorage");
        }
        
        return [data, null];
    } catch (e) {
        console.error("Login error:", e);
        // Check specifically for CORS errors
        if (e instanceof TypeError && e.message.includes('Failed to fetch')) {
            return [null, new Error("Connection error: CORS policy blocked the request. Ensure the backend server allows requests from this origin.")];
        }
        return [null, e];
    }
}

export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('auth_token');
        console.log("Getting current user from:", `${baseUrl}/me`);
        
        if (!token) {
            console.log("No stored token found");
            return [null, new Error("No authentication token found")];
        }
        
        const response = await fetch(`${baseUrl}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include"
        });
        
        if (!response.ok) {
            throw new Error(`Failed to get current user: ${response.status}`);
        }
        
        const userData = await response.json();
        return [userData, null];
    } catch (e) {
        console.error("Error fetching current user:", e);
        // Clear invalid credentials
        if (e instanceof Error && (
            e.message.includes("401") || 
            e.message.includes("403")
        )) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        }
        return [null, e];
    }
};
