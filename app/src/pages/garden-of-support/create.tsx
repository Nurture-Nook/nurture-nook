import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CurrentUserContext } from '@/contexts/current_user_context';
import { PostForm } from '@/components/Features/SupportGarden/PostForm';

const CreatePostPage = () => {
    const { currentUser } = useContext(CurrentUserContext);

    const router = useRouter();

    const [isReady, setIsReady] = useState(false);
    
    useEffect(() => {
        if (router.isReady) setIsReady(true);
    }, [router.isReady, setIsReady])

    useEffect(() => {
        if (currentUser === null) {
            router.push('/entrance');
        }
    }, [currentUser, router]);

    if (!currentUser) {
        return <p>Redirecting to login...</p>;
    }

    if (!isReady) return <p>Loading...</p>;

    return (
        <div className='support-garden-pages'>
            <h2>Create a New Post</h2>
            <PostForm />
        </div>
    );
};

export default CreatePostPage;