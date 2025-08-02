import { useState, useEffect } from 'react';
import { PostOut } from '@/types/post';
import { getPostPreviewById } from '../../../adapters/postAdapters';

interface PostPreviewProps {
    postPreview: PostOut;
}

export const PostPreviewCard: React.FC<PostPreviewProps> = ({ postPreview }) => {
    const [post, setPost] = useState<PostOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = postPreview.id
    
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            const [d, e] = await getPostPreviewById(Number(postId));

            if (e) setError(e);
            else setPost(d);

            setLoading(false);
        }

        fetchPost();
    }, [postId])

    if (loading) return <div>Loading post preview...</div>;

    if (error) return <div>Error Loading Post Preview</div>;

    if (post === null) return;

    return (
        <>
            <h3>{ post.title }</h3>
            <h5>{ post.created_at }</h5>
            <br></br>
            <h4>Content Warnings:</h4>
            <ul>
                {post.content_warnings ? post.content_warnings.map(w => w) : <></>}
            </ul>
        </>
    )
}
