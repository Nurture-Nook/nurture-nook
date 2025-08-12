import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getComments } from '@/adapters/commentAdapters';
import { Comment } from './Comment';
import { CommentOut } from '@/types/comment';
import { CommentForm } from './CommentForm';
import { insertComment } from '@/utils/comments';

export const Comments = () => {
    const router = useRouter();

    const [comments, setComments] = useState<CommentOut[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const postId = Number(router.query.postId);

    const fetchComments = async () => {
        const [d, e] = await getComments(postId);

        if (e) setError(e);
        else setComments(d);

        setLoading(false);
    };

    useEffect(() => {
        if (!postId) return;
        fetchComments();
    }, [postId]);

    const handleSuccess = (newComment: CommentOut) => {
        setComments(prevComments => insertComment(prevComments, newComment));
    };

    if (loading) return <div>Loading comments...</div>;

    if (error) {
        console.error(error);
        return <div>Error Loading Comments</div>;
    }

    if (!comments) return null;

    return (
        <>
            <h3>Comments</h3>
            <CommentForm postId={postId} parentCommentId={null} onSuccess={handleSuccess} />
            <ul>
                {comments.map(c => (
                    <li key={c.id}>
                        <Comment postId={postId} commentId={c.id} />
                    </li>
                ))}
            </ul>
        </>
    );
};
