import { useState } from 'react';
import Link from 'next/link';
import { UserPrivate } from '@/types/user';
import { login } from "../../../adapters/authAdapters";

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
        console.log("Login Form Submitted With Username:", username);

        setErrorText("");
        setIsLoading(true);

        if (!username || !password) return setErrorText("All Fields are Required");

        console.log("Attempting Login With:", { username });
        let loginRes, error;
        
        try {
            [loginRes, error] = await login({
                username,
                password
            });
            
            console.log("Error:", error);

            if (error) {
                console.error("Login Error Details:", error);
                setIsLoading(false);
                return setErrorText(error.message || "Connection Error — Is the Backend Server Running?");
            }
        } catch (e) {
            console.error("Unexpected Login Error:", e);
            setIsLoading(false);
            return setErrorText("Connection Error — Is the Backend Server Running?");
        }

        if (loginRes && loginRes.success) {
            console.log("Login Successful");

            if (loginRes.user) {
                console.log("Using User Data From the Login Response");
                setIsLoading(false);
                onLoginSuccess(loginRes.user);
                return;
            }
            
            setIsLoading(false);
            setErrorText("User Data Not Found in Login Response");
        } else {
            setIsLoading(false);
            setErrorText("Login Failed");
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
