import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { PostDetailedOut } from '@/types/post';
import { CommentOut } from '@/types/comment';
import { ExperientialCategoryBadge } from './ExperientialCategoryBadge';
import { ContentWarningBadge } from './ContentWarningBadge';
import { Comment } from './Comment';
import { getPostById, deletePostById } from '../../../adapters/postAdapters';
import { getCommentsByIds } from '../../../adapters/commentAdapters';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';
import Link from 'next/link';
import { CurrentUserContext } from '@/contexts/current_user_context';

export const Post = () => {
    const router = useRouter();
    const { currentUser } = useContext(CurrentUserContext);

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

    const handleDelete = async () => {
        if (!post) return;

        if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

        const [_, deleteError] = await deletePostById(post.id);
        
        if (deleteError) {
            setError("Failed to Delete Post");
            return;
        }
        router.push('/me');
    };

    if (loading) return <div>Loading post...</div>;
    if (error) return <div>Error Loading Post: {error}</div>;
    if (!post) return <div>No post found</div>;

    return (
        <>
            <div id="post-body">
                <h3>{post.title}</h3>
                <h5>
                    Categories: {post.categories.map(c => (
                        <ExperientialCategoryBadge key={c} categoryId={c} />
                    ))}
                </h5>
                <h4>
                    Content Warnings: {post.content_warnings.map(w => (
                        <ContentWarningBadge key={w} warningId={w} />
                    ))}
                </h4>
                <h5>User: {post.temporary_username}</h5>
                <p>{post.description}</p>

                {currentUser && post.user_id === currentUser.id && (
                    <button onClick={handleDelete}>
                        Delete Post
                    </button>
                )}
            </div>

            <div id="comments">
                <Link href={`/garden-of-support/posts/${postId}/comments`}><h5>Comments:</h5></Link>
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
