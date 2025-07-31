import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login } from "../../../adapters/authAdapters";
import { CurrentUserContext } from "../../../contexts/current_user_context";

export const Login = () => {
    const router = useRouter();

    const {currentUser, setCurrentUser} = useContext(CurrentUserContext);
    const [errorText, setErrorText] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (currentUser) {
            router.push('/me');
        }
    }, [currentUser, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorText("");

        if (!username || !password) return setErrorText("All Fields are Required");

        const [user, error] = await login({
            username,
            password
        });

        if (error) return setErrorText(error.message);

        setCurrentUser(user);
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

                <button>enter</button>
            </form>

            <p>{errorText}</p>

            <p>
                Need to create an account? <Link href="/register">Register</Link>
            </p>
        </>
    )
}
