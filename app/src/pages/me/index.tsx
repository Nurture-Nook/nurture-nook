import { useContext } from 'react';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { MyPosts } from '@/components/Features/Profile/MyPosts';
import { MyComments } from '@/components/Features/Profile/MyComments';
import { useRouter } from 'next/router';

export const PersonalProfile = () => {
    const { currentUser } = useContext(CurrentUserContext);
    const router = useRouter();

    if (!currentUser) {
        return <div>Loading user info...</div>;
    }

    const handleEditProfile = () => {
        router.push('/me/edit');
    };

    const handleDeleteProfile = () => {
        if (confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
        router.push('/enter');
        }
    };

    return (
        <div className="personal-profile-container">
            <h2>Username: {currentUser.username}</h2>

            <div className="profile-actions">
                <button onClick={handleEditProfile}>Edit Profile</button>
                <button onClick={handleDeleteProfile} style={{ color: 'red' }}>
                Delete Profile
                </button>
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
