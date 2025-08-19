import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostOut } from '@/types/post';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getPostPreviewById } from '../../../adapters/postAdapters';

interface PostPreviewProps {
    postId: number;
}

export const PostPreviewCard: React.FC<PostPreviewProps> = ({ postId }) => {
    const [post, setPost] = useState<PostOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            try {
                const [data, err] = await getPostPreviewById(Number(postId));

                if (err) {
                    console.error("Error fetching post preview:", err);
                    setError(err.message || "Failed to load post preview");
                } else if (data) {
                    setPost(data);
                } else {
                    console.error("Post data is null or undefined");
                    setError("Post not found");
                }
            } catch (e) {
                console.error("Exception in fetchPost:", e);
                setError(e instanceof Error ? e.message : "Unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId])

    if (loading) return <div>Loading post preview...</div>;

    if (error) return <div>Error Loading Post Preview: {error}</div>;

    if (!post) return <div>Post not found</div>;

    return (
        <>
            <Link href={`garden-of-support/posts/${postId}`}><h3>{ post.title }</h3></Link>
            <h5>{ post.created_at }</h5>
            <br></br>
            { post.warnings ? <h4>Content Warnings:</h4> : <></> }
            <ul>
                { post.warnings && post.warnings.length > 0 ? 
                    post.warnings.map(w => <li key={w}><ContentWarningBadge warningId={w}/></li>) : <></> }
            </ul>
        </>
    )
}
