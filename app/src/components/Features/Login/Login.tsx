import { useState } from 'react';
import Link from 'next/link';
import { UserPrivate } from '@/types/user';
import { login } from "../../../adapters/authAdapters";
import { getCurrentUser } from '../../../adapters/authAdapters';

interface LoginProps {
    onLoginSuccess: (newUser: UserPrivate) => void;
}

export const Login: React.FC<LoginProps> = ({onLoginSuccess}) => {
    const [errorText, setErrorText] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Login form submitted with username:", username);

        setErrorText("");
        setIsLoading(true);

        if (!username || !password) return setErrorText("All Fields are Required");

        console.log("Attempting login with:", { username });
        let loginRes, error;
        
        try {
            [loginRes, error] = await login({
                username,
                password
            });
            
            console.log("Login response:", loginRes, "Error:", error);

            if (error) {
                console.error("Login error details:", error);
                setIsLoading(false);
                return setErrorText(error.message || "Connection error - Is the backend server running?");
            }
        } catch (e) {
            console.error("Unexpected login error:", e);
            setIsLoading(false);
            return setErrorText("Connection error - Is the backend server running?");
        }

        if (loginRes && loginRes.success) {
            console.log("Login successful, fetching user data");
            console.log("Cookies after login:", document.cookie);
            
            // Store username for direct fetch
            localStorage.setItem('debug_username', username);
            
            let user = null;
            let userError = null;
            
            // Try direct method first (most reliable)
            try {
                console.log("Trying direct fetch from get-user-by-username");
                const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';
                const directResponse = await fetch(
                    `${apiBase}/get-user-by-username?username=${encodeURIComponent(username)}`,
                    { method: 'GET' }
                );
                
                if (directResponse.ok) {
                    const data = await directResponse.json();
                    console.log("Direct fetch successful:", data);
                    
                    if (data.user) {
                        user = data.user;
                        if (data.token) {
                            localStorage.setItem('auth_token', data.token);
                        }
                    }
                }
            } catch (e) {
                console.error("Error with direct fetch:", e);
            }
            
            // If direct method failed, try standard method
            if (!user) {
                console.log("Trying standard getCurrentUser");
                [user, userError] = await getCurrentUser();
            }
            
            if (userError) {
                console.error("Error fetching user info after multiple attempts:", userError);
                setIsLoading(false);
                return setErrorText(`Could not fetch user info: ${userError.message}`);
            }
            
            if (user) {
                console.log("User data fetched successfully:", user);
                // Store in localStorage for persistence
                try {
                    localStorage.setItem('user_data', JSON.stringify(user));
                } catch (e) {
                    console.error("Could not save user data to localStorage", e);
                }
                
                onLoginSuccess(user);
            } else {
                setIsLoading(false);
                setErrorText("User data not available");
            }
        } else {
            setIsLoading(false);
            setErrorText("Login failed");
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
    };

    return (
        <>
            <form
                className='login-form'
                onSubmit={handleSubmit}
                aria-labelledby='user-sign-in-form'
            >
                <h2 id='login-heading'>Login</h2>

                <label htmlFor="username">Username</label>
                <input
                    autoComplete="off"
                    type="text"
                    id="username"
                    name="username"
                    onChange={handleChange}
                    value={username}
                />

                <label htmlFor="password">Password</label>
                <input
                    autoComplete="off"
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleChange}
                    value={password}
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Enter'}
                </button>
            </form>

            <p>{errorText}</p>

            <p>
                Need to create an account? <Link href="/register">Register</Link>
            </p>
        </>
    )
}
