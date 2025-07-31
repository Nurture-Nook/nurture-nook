import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PostOut } from '@/types/post';
import { getPostPreviewById } from '../../../adapters/postAdapters';

export const PostPreviewCard = () => {
const router = useRouter();

    const [post, setPost] = useState<PostOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = router.query;

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            const [d, e] = await getPostPreviewById(Number(postId));

            if (e) setError(e);
            else setPost(d);

            setLoading(false);
        }

        fetchPost();
    }, [])

    if (loading) return <div>Loading post...</div>;

    if (error) return <div>Error Loading Post</div>;

    if (post === null) return;

    return (
        <>
            <h3>{ post.title }</h3>
            <h5>{ post.created_at }</h5>
        </>
    )
}
