import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPostsByUser } from '../../../adapters/userAdapters';
import { PostOut } from '@/types/post';
import { PostPreviewCard } from '../SupportGarden/PostPreviewCard';

export const MyPosts = () => {
    const [posts, setPosts] = useState<PostOut[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const [data, err] = await getPostsByUser();

            if (err) setError(err);
            else setPosts(data);

            setLoading(false);
        };

        fetchPosts();
    }, []);

    if (loading) return <div>Loading your posts...</div>;
    if (error) return <div>Error loading posts: {error}</div>;
    if (!posts || posts.length === 0) return <div>No Posts Found</div>;

    return (
        <div>
            <h3>My Posts</h3>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>
                        { <PostPreviewCard postOut={post}/> }
                    </li>
                ))}
            </ul>
        </div>
    );
};
