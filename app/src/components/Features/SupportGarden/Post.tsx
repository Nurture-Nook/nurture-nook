import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PostDetailedOut } from '@/types/post';
import { ExperientialCategoryBadge } from './ExperientialCategoryBadge';
import { ContentWarningBadge } from './ContentWarningBadge';
import { Comment } from './Comment';
import { getPostById } from '../../../adapters/postAdapters';

export const Post = () => {
    const router = useRouter();

    const [post, setPost] = useState<PostDetailedOut | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = router.query;

    useEffect(() => {
        if (!postId) return;

        const fetchPost = async () => {
            const [d, e] = await getPostById(Number(postId));

            if (e) setError(e);
            else setPost(d);

            setLoading(false);
        }

        fetchPost();
    }, [postId])

    if (loading) return <div>Loading post...</div>;

    if (error) return <div>Error Loading Post</div>;

    if (post === null) return;

    return (
        <>
            <div id="post-body">
                <h3>{ post.title }</h3>
                <h5>Categories: { post.categories.map(c => <ExperientialCategoryBadge categoryId={c}/>) }</h5>
                <h4>Content Warnings: { post.content_warnings.map(w => <ContentWarningBadge warningId={w}/>) }</h4>
                <h5>User: { post.temporary_username }</h5>
                <p>{ post.description }</p>
            </div>
            <div id="comments">
                <h5>Comments:</h5>
                <ul>{ post.comments.map(c => <Comment postId={post.id} commentId={c}/>) }</ul>
            </div>
        </>
    )
}
