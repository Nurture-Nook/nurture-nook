import { useState, useContext } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { updateProfile } from "@/adapters/userAdapters"; // adjust path
import { useRouter } from "next/router";

export const EditMyProfile: React.FC = () => {
    const { currentUser } = useContext(CurrentUserContext);
    const router = useRouter();

    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const canSubmit = () =>
        (newUsername.trim() !== "" || newEmail.trim() !== "" || newPassword.trim() !== "") &&
        currentPassword.trim() !== "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!canSubmit()) {
            setError("Please Fill at Least One field to Update and your Current Password.");
            return;
        }

        setLoading(true);

        const payload = {
        ...(newUsername.trim() && { new_username: newUsername.trim() }),
        ...(newEmail.trim() && { new_email: newEmail.trim() }),
        current_password: currentPassword.trim(),
        ...(newPassword.trim() && { new_password: newPassword.trim() }),
        };

        const [, err] = await updateProfile(payload);

        setLoading(false);

        if (err) setError(err);
        else {
            setSuccess("Profile updated successfully!");
            setNewUsername("");
            setNewEmail("");
            setCurrentPassword("");
            setNewPassword("");
            router.push("/me")
        }
    };

    if (!currentUser) return <p>Loading user data...</p>;

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
            <h2>Edit Profile</h2>

            <label>
                New Username
                <input
                type="text"
                placeholder={ currentUser.username }
                value={ newUsername }
                onChange={(e) => setNewUsername(e.target.value)}
                />
            </label>

            <label>
                New Email
                <input
                type="email"
                placeholder={ currentUser.email || "enter new email" }
                value={ newEmail }
                onChange={(e) => setNewEmail(e.target.value)}
                />
            </label>

            <label>
                Current Password <span style={{ color: "red" }}>*</span>
                <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                />
            </label>

            <label>
                New Password
                <input
                type="password"
                placeholder="leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </label>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</button>
        </form>
    );
};
