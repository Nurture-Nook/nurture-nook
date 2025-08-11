import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { PostDetailedOut } from '@/types/post';
import { CommentOut } from '@/types/comment';
import { ExperientialCategoryBadge } from './ExperientialCategoryBadge';
import { ContentWarningBadge } from './ContentWarningBadge';
import { Comment } from './Comment';
import { getPostById } from '../../../adapters/postAdapters';
import { getCommentsByIds } from '../../../adapters/commentAdapters';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';

export const Post = () => {
    const router = useRouter();

    const [post, setPost] = useState<PostDetailedOut | null>(null);
    const [comments, setComments] = useState<CommentOut[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const postId = Number(router.query.postId);

    useEffect(() => {
        if (!postId) return;

        const fetchPostAndComments = async () => {
            const [data, error] = await getPostById(postId);

            if (error) {
                setError(error);
                setLoading(false);
                return;
            }

            setPost(data);

            if (data.comments.length > 0) {
                const [commentsData, commentsError] = await getCommentsByIds(data.id, data.comments);

                if (commentsError) {
                    setError(commentsError);
                    setLoading(false);
                    return;
                }

                setComments(commentsData);
            } else {
                setComments([]);
            }

            setLoading(false);
        };

        fetchPostAndComments();
    }, [postId]);

    const handleCommentSuccess = (newComment: CommentOut) => {
        setComments(prevComments => insertComment(prevComments, newComment));
    };

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error Loading Post: {error}</div>;
    if (!post) return <div>No post found</div>;

    return (
        <>
            <div id="post-body">
                <h3>{post.title}</h3>
                <h5>Categories: {post.categories.map(c => (<ExperientialCategoryBadge key={c} categoryId={c} />))}</h5>
                <h4>Content Warnings: {post.content_warnings.map(w => (<ContentWarningBadge key={w} warningId={w} />))}</h4>
                <h5>User: {post.temporary_username}</h5>
                <p>{post.description}</p>
            </div>

            <div id="comments">
                <h5>Comments:</h5>
                <CommentForm postId={post.id} parentCommentId={null} onSuccess={handleCommentSuccess} />
                <ul>
                    {comments.map(comment => (
                        <Comment key={comment.id} postId={post.id} commentId={comment.id} />
                    ))}
                </ul>
            </div>
        </>
    );
};
