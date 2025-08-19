import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostOut } from '@/types/post';
import { ContentWarningBadge } from './ContentWarningBadge';
import { getPostPreviewById } from '../../../adapters/postAdapters';

interface PostPreviewProps {
    postOut?: PostOut;
    postId?: number;
}

export const PostPreviewCard: React.FC<PostPreviewProps> = ({ postOut, postId }) => {
    const [post, setPost] = useState<PostOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (postOut) {
            setPost(postOut);
            setLoading(false);
        } else if (postId) {
            const fetchPost = async () => {
                try {
                    const [data, err] = await getPostPreviewById(Number(postId));
                    if (err) {
                        setError(err.message || "Failed to load post preview");
                    } else if (data) {
                        setPost(data);
                    } else {
                        setError("Post not found");
                    }
                } catch (e) {
                    setError(e instanceof Error ? e.message : "Unknown error occurred");
                } finally {
                    setLoading(false);
                }
            };
            fetchPost();
        }
    }, [postOut, postId]);

    if (!postId && !postOut) return null;
    if (loading) return <div>Loading post preview...</div>;
    if (error) return <div>Error Loading Post Preview: {error}</div>;
    if (!post) return <div>Post not Found</div>;

    return (
        <>
            <Link href={`garden-of-support/posts/${post.id}`}>
                <h3>{post.is_deleted ? "[deleted]" : post.title}</h3>
            </Link>
            <p>{post.is_deleted ? "[deleted]" : post.description}</p>
            <h5>{post.created_at}</h5>
            <br />
            {post.warnings && post.warnings.length > 0 && <h4>Content Warnings:</h4>}
            <ul>
                {post.warnings && post.warnings.length > 0
                    ? post.warnings.map(w => <li key={w}><ContentWarningBadge warningId={w} /></li>)
                    : null}
            </ul>
        </>
    );
}
