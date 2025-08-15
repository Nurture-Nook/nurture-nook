import { useState } from 'react';
import Link from 'next/link';
import { UserPrivate } from '@/types/user';
import { register, getCurrentUser } from "../../../adapters/authAdapters";


interface RegisterProps {
    onRegisterSuccess: (newUser: UserPrivate) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const usernamePattern = /^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]{3,15}$/;
    const passwordPattern = /^(?=(.*[a-zA-Z]){5,})(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/;
    const [errorText, setErrorText] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [usernameFormattingIssue, setUsernameFormattingIssue] = useState(false);
    const [passwordFormattingIssue, setPasswordFormattingIssue] = useState(false);
    const [emailFormattingIssue, setEmailFormattingIssue] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted with data:", { email, username, password, passwordConfirm });

        setErrorText('');
        setUsernameFormattingIssue(false);
        setPasswordFormattingIssue(false);
        setEmailFormattingIssue(false);
        setIsLoading(true);

        if (!email || !username || !password || !passwordConfirm) {
            console.log("Missing required fields");
            setErrorText("All Fields are Required");
            return;
        }

        // Check all format requirements
        let hasFormattingIssues = false;
        
        if (!usernamePattern.test(username)) {
            console.log("Username format issue");
            setUsernameFormattingIssue(true);
            hasFormattingIssues = true;
        }
        
        if (!passwordPattern.test(password)) {
            console.log("Password format issue");
            setPasswordFormattingIssue(true);
            hasFormattingIssues = true;
        }
        
        if (!emailPattern.test(email)) {
            console.log("Email format issue");
            setEmailFormattingIssue(true);
            hasFormattingIssues = true;
        }
        
        if (password != passwordConfirm) {
            console.log("Passwords don't match");
            setErrorText("Password Confirmation Must Match Password");
            return;
        }
        
        if (hasFormattingIssues) {
            console.log("Formatting issues detected, stopping submission");
            return;
        }
         console.log("All validations passed, proceeding with registration");
        console.log("Attempting registration with:", { username, email });
        
        let registerRes, error;
        try {
            [registerRes, error] = await register({
                username,
                email,
                password
            });
            
            console.log("Registration response:", registerRes, "Error:", error);

            if (error) {
                console.error("Registration error details:", error);
                setIsLoading(false);
                return setErrorText(error.message || "Connection error - Is the backend server running?");
            }
        } catch (e) {
            console.error("Unexpected registration error:", e);
            setIsLoading(false);
            return setErrorText("Connection error - Is the backend server running?");
        }

        if (registerRes && registerRes.success) {
            console.log("Registration successful, fetching user data");
            const [user, userError] = await getCurrentUser();
            console.log("User data:", user, "User error:", userError);
            
            if (userError) return setErrorText("Could Not Fetch User Info");
            if (user) {
                onRegisterSuccess(user);
            } else {
                setIsLoading(false);
                setErrorText("User data not available");
            }
        } else {
            setIsLoading(false);
            setErrorText("Registration failed");
        }
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

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                </button>
            </form>

            { usernameFormattingIssue ? <>
                <p>Username Must be Between Three and 15 Characters Long. Using Only Letters (uppercase or lowercase), Numbers, or Underscores With at Least Three Letters.</p>
                <br></br>
                </> : <>
            </>}
            
            { passwordFormattingIssue ? <>
                <p>Password Must be Between Eight and 15 Characters Long. Containing at Least Five Letters, at Least One Number, and at Least One Special Character From "!@#$%^&*". Use only letters, numbers, and those special characters.</p>
                <br></br>
                </> : <>
            </> }

            { emailFormattingIssue ? <>
                <p>Enter a Valid Email</p>
                <br></br>
                </> : <>
            </> }

            <p>{errorText}</p>

            <p>
                Already have an account with us? <Link href="/login">Log In</Link>
            </p>
        </>
    )
}
