import { useState } from 'react';
import Link from 'next/link';
import { UserPrivate } from '@/types/user';
import { register } from "../../../adapters/authAdapters";


interface RegisterProps {
    onRegisterSuccess: (newUser: UserPrivate) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const [errorText, setErrorText] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrorText('');

        if (!email || !username || !password || !passwordConfirm) return setErrorText("All Fields are Required");

        if (password != passwordConfirm) return setErrorText("Password Confirmation Must Match Password");

        const [user, error] = await register({
            username,
            email,
            password
        });

        if (error) return setErrorText(error.message);

        onRegisterSuccess(user);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email") setEmail(value);
        if (name === "username") setUsername(value);
        if (name === "password") setPassword(value);
        if (name === "password-confirm") setPasswordConfirm(value);
    };

    return (
        <>

            <form
                className="registration-form"
                onSubmit={handleSubmit}
                aria-labelledby="create-user-form"
            >
                <h2 id="create-heading">Register</h2>

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

                <label htmlFor="password-confirm">Confirm Password</label>
                <input
                    autoComplete="off"
                    type="password"
                    id="password-confirm"
                    name="password-confirm"
                    onChange={handleChange}
                    value={passwordConfirm}
                />

                <label htmlFor="email">Email</label>
                <input
                    type="text"
                    autoComplete="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                />

                <button>Register</button>
            </form>

            <p>{errorText}</p>

            <p>
                Already have an account with us? <Link href="/login">Log in</Link>
            </p>
        </>
    )
}
