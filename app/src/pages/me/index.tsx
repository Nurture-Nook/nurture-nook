import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { MyPosts } from '@/components/Features/Profile/MyPosts';
import { MyComments } from '@/components/Features/Profile/MyComments';

export default function PersonalProfile() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    
    const router = useRouter();

    const [isReady, setIsReady] = useState(false)
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    const handleEditProfile = () => router.push('/me/edit');
    const handleDeleteProfile = () => {
        if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) router.push('/enter');
    };

    const handleLogout = useCallback(async () => {
        try {
            await fetch("http://localhost:8000/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("auth_token") ? `Bearer ${localStorage.getItem("auth_token")}` : ""
                }
            });
            localStorage.removeItem("auth_token");
        } catch (e) {
            localStorage.removeItem("auth_token");
        }
        setCurrentUser(null);
        router.push("/entrance");
    }, [setCurrentUser, router]);

    if (!isReady) return <p>Loading...</p>;

    if (!currentUser) {
        router.push('/entrance');
        return null;
    }

    return (
        <div className="personal-profile-container">
            <h2>Username: {currentUser.username}</h2>

            <div className="profile-actions">
                <button onClick={handleEditProfile}>Edit Profile</button>
                <button onClick={handleDeleteProfile}>
                Delete Profile
                </button>
                <button onClick={handleLogout}>Log Out</button>
            </div>

            <section className="my-posts-section">
                <h3>My Posts</h3>
                <MyPosts />
            </section>

            <section className="my-comments-section">
                <h3>My Comments</h3>
                <MyComments />
            </section>
        </div>
    );
};
